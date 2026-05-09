from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Category, Product, Order, OrderItem, Cart, CartItem
from .serializers import CategorySerializer, ProductSerializer, OrderSerializer, CartSerializer
from django.db import transaction
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        # Only farmers can create products
        if self.request.user.is_farmer:
            serializer.save(farmer=self.request.user)
        else:
            from django.core.exceptions import PermissionDenied
            raise PermissionDenied("Only farmers can list products.")

class CartViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    def list(self, request):
        cart = self.get_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='add-item')
    def add_item(self, request):
        cart = self.get_cart(request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()
        
        return Response({"message": "Item added to cart"}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['delete'], url_path='remove-item/(?P<item_id>[0-9]+)')
    def remove_item(self, request, item_id=None):
        cart = self.get_cart(request.user)
        try:
            item = CartItem.objects.get(id=item_id, cart=cart)
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found in cart"}, status=status.HTTP_404_NOT_FOUND)

class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_farmer:
            # Farmers see orders containing their products
            return Order.objects.filter(items__product__farmer=user).distinct()
        return Order.objects.filter(customer=user)

    def create(self, request, *args, **kwargs):
        user = request.user
        cart, _ = Cart.objects.get_or_create(user=user)
        items = cart.items.all()

        if not items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        shipping_address = request.data.get('shipping_address')
        if not shipping_address:
            return Response({"error": "Shipping address is required"}, status=status.HTTP_400_BAD_REQUEST)

        total_price = sum(item.product.price * item.quantity for item in items)

        with transaction.atomic():
            order = Order.objects.create(
                customer=user,
                total_price=total_price,
                shipping_address=shipping_address
            )
            for item in items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    price=item.product.price,
                    quantity=item.quantity
                )
                # Deduct stock
                item.product.quantity_available -= item.quantity
                item.product.save()
            
            # Clear cart
            items.delete()

        serializer = self.get_serializer(order)
        
        # Send confirmation email
        try:
            self.send_order_confirmation_email(order)
        except Exception as e:
            print(f"Failed to send email: {e}")

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def send_order_confirmation_email(self, order):
        subject = f'Order Confirmation #{order.id} - FarmerDirect'
        from_email = settings.DEFAULT_FROM_EMAIL
        to = order.customer.email
        
        if not to:
            return

        html_content = render_to_string('marketplace/order_confirmation.html', {'order': order})
        text_content = strip_tags(html_content)

        msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
        msg.attach_alternative(html_content, "text/html")
        msg.send()
