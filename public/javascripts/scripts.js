let array = [];
var checkboxes = document.querySelectorAll(".checkbox");


checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {

        if (checkbox.checked == true) {
            array.push({ key: checkbox.dataset.key, value: checkbox.dataset.value });
        } else {
            array = array.filter(a => a.value !== checkbox.dataset.value);
        }
        let url = new URL(window.location.href + '/classes/');
        if (url.searchParams) {
            for (var key of url.searchParams.keys()) {
                url.searchParams.delete(key);
            }
        }
        array.forEach(arrayItem => {
            url.searchParams.append(arrayItem.key, arrayItem.value);
        })

        function updateClassList() {
            query = url;
            const response = fetch(url)
                .then(response => response.json())
                .then(data => {
                    classes_obj = data;
                    let obj = JSON.parse(classes_obj);
                    document.querySelector("#classes").innerHTML = "";
                    obj.forEach(singleObject => {
                        singleObject.date = moment(singleObject.class_date).format('DD.MM.YYYY');
                        showClassesOverview(singleObject);
                    })
                }
                );
        }
        updateClassList();

    });
})



let itemsInBasket = [];

let basketButtons = document.querySelectorAll("#basket")
basketButtons.forEach(button => {
    button.addEventListener('click', function addToBasket(event) {

        let targetedButton = this.querySelector(".addToBasketBtnValue");
        let targetedIcon = this.querySelector(".material-symbols-outlined");
        
        targetedIcon.classList.add("filled_icon");

        targetedButton.innerText = 'in the basket';
       
        let addedClass = targetedButton.parentElement.parentElement.parentElement;
        console.log(addedClass);

        if (itemsInBasket.includes(addedClass)) {
            console.log("class already there");
            console.log(itemsInBasket);
        } else {
            itemsInBasket.push(addedClass);
            console.log(itemsInBasket);
        }
    })
});