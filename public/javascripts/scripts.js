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
                        console.log(singleObject);
                        // showClassesOverview(singleObject);
                    })
                })
        }
        updateClassList();
    });
})



let basketButtons = document.querySelectorAll("#basket");
basketButtons.forEach(button => {
    button.addEventListener('click', function signUpForClass() {

        let targetedButton = this.querySelector(".addToBasketBtnValue");
        let targetedIcon = this.querySelector(".material-symbols-outlined");
        targetedIcon.classList.add("filled_icon");
        targetedButton.innerText = 'signed up';
        let addedClass = targetedButton.parentElement.parentElement.parentElement;

        let addedClass_id = addedClass.querySelector(".classID").innerHTML;

        console.log(addedClass_id);


        let classData = {
            class_id: addedClass_id
        }


        const response = fetch('/class_signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(classData)
        })
        // return response.json();

    })
});




let location_divs = document.querySelectorAll(".single_class_location");
location_divs.forEach(location_div => {
    location_div.addEventListener("click", function () {
        console.log("click");
        let googleMapsURL = this.querySelector(".googleLocation").innerHTML;
        console.log(googleMapsURL);

        document.querySelector(".map_text").style = "display:none";
        document.querySelector(".map_iframe").src = googleMapsURL;

    })
})

