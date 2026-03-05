document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      alert('Produto adicionado ao carrinho!');
    });
  });