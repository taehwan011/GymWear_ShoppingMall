document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const name = button.getAttribute('data-name');
      const price = parseInt(button.getAttribute('data-price'));
      const image = button.getAttribute('data-image');

      // 사용자에게 확인 메시지 표시
      const addConfirm = confirm('장바구니에 상품을 추가하시겠습니까?');

      if (addConfirm) {
        const cartItem = { name, price, image };
        //서버에 요청
        fetch('/add-to-cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(cartItem)
        })
          .then(response => {
            return response.text();
          })
          .then(data => {
            alert(data);
          })
      }
    });
  });
});
