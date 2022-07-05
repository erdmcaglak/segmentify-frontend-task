import productList from "./product-list.json" assert {type:"json"};
import {stringShorter} from "./utils/utils.js"


const responses = productList.responses[0][0].params || {}
const categories = responses.userCategories || [];
const backArrow = document.getElementById('arrow-left')
const leftIcon = document.getElementById('left-icon')
const nextArrow = document.getElementById('arrow-right')
const rightIcon = document.getElementById('right-icon')
const sliderWrapper = document.getElementById('slider-wrapper')

let selectedCategorie = 'Size Özel'

// Menu items
for(let item of categories){
    let menuItem = document.createElement('div');
    let menuText = document.createElement('div');

    menuText.innerText = `${stringShorter(item,20)}`
    menuItem.setAttribute('id',item);
    
    if(item === selectedCategorie)
        menuItem.classList.add('selected-menu-item')
    else
        menuItem.classList.add('menu-item')
    
    menuText.classList.add('menu-text')

    menuItem.addEventListener('click',()=>changeCategorie(item,menuItem))

    document.getElementById('menu-side').appendChild(menuItem);
    menuItem.appendChild(menuText);
}


// Slide items
const createSlideItems = ()=>{
    for(let item of responses.recommendedProducts[selectedCategorie]){
        if(!item.image || !item.name || !item.priceText) continue;
        
        let sliderItem = document.createElement('div');
        let sliderItemImage = document.createElement('img')
        let sliderItemName = document.createElement('div')
        let sliderItemPrice = document.createElement('div')
        let shippinFeeWrapper = document.createElement('div')
        let cargoIcon = document.createElement('img')
        let freeCargoText = document.createElement('div')
        let addBasketButton = document.createElement('div')
    
        //options
        sliderItemImage.setAttribute('src',item.image)
        sliderItemName.innerText = `${stringShorter(item.name,50)}`
        sliderItemPrice.innerText = `${item.priceText}`
        addBasketButton.innerText = 'Sepete Ekle'

        if(item.params.shippingFee === 'FREE'){
            cargoIcon.setAttribute('src','./assets/icons/cargo.svg')
            freeCargoText.innerText = 'Ücretsiz Kargo'
            cargoIcon.classList.add('cargo-icon')
            freeCargoText.classList.add('cargo-text')
        }
    
        //classes
        sliderItem.classList.add('slider-item')
        sliderItemImage.classList.add('slider-item-image')
        sliderItemName.classList.add('slider-item-name')
        sliderItemPrice.classList.add('slider-item-price')
        shippinFeeWrapper.classList.add('free-cargo')
        addBasketButton.classList.add('add-basket-button')

        addBasketButton.addEventListener('click',()=>addBasket(item))
    
        //add child
        shippinFeeWrapper.appendChild(cargoIcon)
        shippinFeeWrapper.appendChild(freeCargoText)
    
        sliderItem.appendChild(sliderItemImage)
        sliderItem.appendChild(sliderItemName)
        sliderItem.appendChild(sliderItemPrice)
        sliderItem.appendChild(shippinFeeWrapper)
        sliderItem.appendChild(addBasketButton)
        
        sliderWrapper.appendChild(sliderItem);
    }
}

// Change categorie
const changeCategorie = (item,menuItem)=>{
    if(selectedCategorie === item) return;

    document.getElementById(`${selectedCategorie}`).classList.remove('selected-menu-item')
    document.getElementById(`${selectedCategorie}`).classList.add('menu-item')

    selectedCategorie = item;

    menuItem.classList.remove('menu-item')
    menuItem.classList.add('selected-menu-item')

    while(sliderWrapper.firstChild){
        sliderWrapper.removeChild(sliderWrapper.firstChild)
    }
    createSlideItems();
    sliderWrapper.style.transform=`translateX(0px)`
    leftIcon.removeAttribute('src');
    leftIcon.setAttribute('src','./assets/icons/arrow-left-disabled.svg')
    rightIcon.removeAttribute('src');
    rightIcon.setAttribute('src','./assets/icons/arrow-right.svg')
    sliderCounter = 0
    translatePosition = 0
}

// Add basket

let popupCount = 0;
let popupWrapper; 
let popupMap = {}

//! If have anyone popup this func dont work
const popupWrapperCreator = ()=>{
    popupWrapper = document.createElement('div')
    popupWrapper.classList.add('popup-wrapper')
}


// Add an item basket
const addBasket = (item)=>{
    // console.log({item})
    let body = document.querySelector('body');
    let addedPopup = document.createElement('div')
    let confirmIcon = document.createElement('div')
    let tickIcon = document.createElement('img')
    let popupTexts = document.createElement('div')
    let confirmText = document.createElement('div')
    let goToBasket = document.createElement('div')
    let closePopup = document.createElement('div')
    let closeIcon = document.createElement('img')

    if(popupCount === 0) popupWrapperCreator()

    let utid = Math.floor(Math.random()*1e4)
    // attribute
    tickIcon.setAttribute('src','./assets/icons/check.svg')
    closeIcon.setAttribute('src','./assets/icons/close.svg')
    addedPopup.setAttribute('id',utid)
    
    // classes
    
    addedPopup.classList.add('added-popup')
    confirmIcon.classList.add('confirm-icon')
    tickIcon.classList.add('icon')
    popupTexts.classList.add('popup-texts')
    confirmText.classList.add('confirm-text')
    goToBasket.classList.add('go-to-basket')
    closePopup.classList.add('close-popup')
    closeIcon.classList.add('icon')

    confirmText.innerText = 'Ürün sepete eklendi.'
    goToBasket.innerText = 'Sepete Git'

    closePopup.addEventListener('click',()=>closePopupFunc(utid))

    // child
    confirmIcon.appendChild(tickIcon)
    popupTexts.appendChild(confirmText)
    popupTexts.appendChild(goToBasket)
    closePopup.appendChild(closeIcon)

    addedPopup.appendChild(confirmIcon)
    addedPopup.appendChild(popupTexts)
    addedPopup.appendChild(closePopup)

    popupWrapper.appendChild(addedPopup)

    if(popupCount === 0) body.appendChild(popupWrapper);
    popupCount++;
    
    popupMap[utid] = {}
    popupMap[utid].clear = setTimeout(() => {
        popupWrapper.removeChild(popupWrapper.firstChild);
        popupCount--;
        if(popupCount === 0)
            body.removeChild(popupWrapper)
    }, 3e3);
    
}

// Close popup
const closePopupFunc = (uid) =>{
    let body = document.querySelector('body');
    clearTimeout(popupMap[uid].clear);
    delete popupMap[uid]
    popupWrapper.removeChild(document.getElementById(`${uid}`));
    popupCount--;
    if(popupCount === 0)
        body.removeChild(popupWrapper)
}


// Slide operations
let sliderCounter = 0;
let translatePosition = 0
let currentPositionAdd = 242;

if(window.innerWidth>1024 && window.innerWidth <=1440)
    currentPositionAdd = 228

else if(window.innerWidth>768 && window.innerWidth <=1024)
    currentPositionAdd = 214

else if(window.innerWidth>480 && window.innerWidth <=768)
    currentPositionAdd = 202

else if(window.innerWidth <=480)
    currentPositionAdd = 182

else
    currentPositionAdd = 242


window.addEventListener('resize',e=>{
    sliderCounter = 0;
    translatePosition = 0
    sliderWrapper.style.transform=`translateX(0px)`
    if(window.innerWidth>1024 && window.innerWidth <=1440)
        currentPositionAdd = 228
    
    else if(window.innerWidth>768 && window.innerWidth <=1024)
        currentPositionAdd = 214
    
    else if(window.innerWidth>480 && window.innerWidth <=768)
        currentPositionAdd = 202
    
    else if(window.innerWidth <=480)
        currentPositionAdd = 182
    
    else
        currentPositionAdd = 242
    
})

backArrow.addEventListener('click',()=>{
    if(sliderCounter<=0) return;
    
    rightIcon.removeAttribute('src');
    rightIcon.setAttribute('src','./assets/icons/arrow-right.svg')
    translatePosition+=currentPositionAdd
    sliderCounter--
    sliderWrapper.style.transform=`translateX(${translatePosition}px)`
    if(sliderCounter === 0){
        leftIcon.removeAttribute('src');
        leftIcon.setAttribute('src','./assets/icons/arrow-left-disabled.svg')
    }
    
})

nextArrow.addEventListener('click',()=>{
    if(responses.recommendedProducts[selectedCategorie].length -1 <= sliderCounter) return;

    leftIcon.removeAttribute('src');
    leftIcon.setAttribute('src','./assets/icons/arrow-left.svg')
    sliderCounter++;
    translatePosition-=currentPositionAdd
    sliderWrapper.style.transform=`translateX(${translatePosition}px)`
    if(sliderCounter === responses.recommendedProducts[selectedCategorie].length -5){
        rightIcon.removeAttribute('src');
        rightIcon.setAttribute('src','./assets/icons/arrow-right-disabled.svg')
    }
    
    
})

createSlideItems();


