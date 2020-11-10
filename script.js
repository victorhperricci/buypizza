let modalQt = 1;
let cart = [];
let modalKey = 0;

const c = (el) => {
    return document.querySelector(el);
}

const cs = (el) => {
     return document.querySelectorAll(el);
}

// Listagem das Pizzas  
pizzaJson.map((item, index) => {
    // clona cada um dos itens do array pizzaJson
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    // atribui um valor 'data-key' de indice a cada elemtento q tiver em pizzaItem
    pizzaItem.setAttribute('data-key' , index );
    // preencher as informaçoes em  pizza-item
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;  // IMAGEM
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`; // PREÇO
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name; // NOME 
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description; // DESCRIÇÃO
    
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault(); // remove o evento padrao de atualizar a tela
        let key = e.target.closest('.pizza-item').getAttribute('data-key'); // closest = acha o elemento mais próximo que foi atribuido nos ('')
        modalQt = 1;
        modalKey = key;

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `${pizzaJson[key].price.toFixed(2)}`

        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex == 2) {
                size.classList.add('selected')
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';    
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);

    });

    // poe as informaçoes na area desejada
    c('.pizza-area').append(pizzaItem);
});

// Eventos do Modal

// evento de fechar o modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

// coloca o evento nos botoes de sair e consequetemente voltar para o " menu "
cs('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton, .pizzaWindowArea .X').forEach((item) => {
    item.addEventListener('click', closeModal);
});

// Evento de quatidade de Pizzas
c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(modalQt > 1) {
    modalQt--
    c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

c('.pizzaInfo--qtmais').addEventListener('click', () => {
    if(modalQt < 10) {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
    };
});
// -------------------------------------------------------------------

// Evento dos Tamanhos
cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected')
    });
});

// Evento no adicionar ao carrinho

c('.pizzaInfo--addButton').addEventListener('click', () => {
    // qual a pizza? modalKey
    // qual o tamanho selecionado?
    // quantas pizzas? modalQt
    
    let size = Number(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id+'@'+size;
    let key = cart.findIndex((item) => {
        return item.identifier == identifier;
    });

    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    };
    updateCart();
    closeModal();
    
});


c('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
});


function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(i in cart) {
            let pizzaItem = pizzaJson.find((item) => {
                return item.id == cart[i].id
            });

            subtotal += pizzaItem.price * cart[i].qt;

            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = '( P )';
                    break;
                case 1:
                    pizzaSizeName = '( M )';
                    break;
                case 2:
                    pizzaSizeName = '( G )';
                    break;
            }
            let pizzaName = `${pizzaItem.name} ${pizzaSizeName}`;
            let cartItem = c('.models .cart--item').cloneNode(true);

            cartItem.querySelector('.cart--item img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            })
            
            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
        
    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
};