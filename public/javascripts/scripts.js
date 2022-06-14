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
                        showClassesOverview(singleObject);
                    })
                })
        }
        updateClassList();

    });
})

function showClassesOverview(singleObject) {
    document.querySelector("#classes").innerHTML += `
    <div class="single_class_container">
    <div class="single_class_top">
    </div>
    <div class="single_class_wrapper">
            <div class="single_class_col col_left">
                    <div>
                            <img class="single_class_thumbnail"
                                    src="/images/pexels-andrea-piacquadio-3757955.jpg"
                                    alt="yoga_class">
                    </div>
                    <div class="single_class_duration grey">
                            <span class="material-symbols-outlined">timer</span>
                            ${singleObject.class_duration} min
                    </div>
                    <div class="">1.2 km away</div>
                    <div class="classID" style="display:none">
                            ${singleObject.class_id} </div>
            </div>
            <div class="single_class_col col_mid">
                    <div class="single_class_title">${singleObject.class_type} Yoga
                            class <span>
                                    ${(singleObject.class_language === 'Danish' ? "🇩🇰" : '🇺🇸')}
                            </span> 
                    </div>

                    <div
                            class="single_class_location hover-underline-animation grey">

                            <span class="material-symbols-outlined">pin_drop</span>
                            ${singleObject.location_street}
                            ${singleObject.location_building},
                            ${singleObject.location_zipcode}
                            <span class="googleLocation" style="display:none">
                                    ${singleObject.location_map}</span>
                    </div>
                    <div
                            class="single_class_instructor grey hover-underline-animation">
                            <a href="/instructor/${singleObject.instructor_id}"
                                    class="grey" style="text-decoration:none">
                                    <span
                                            class="material-symbols-outlined">self_improvement</span>
                                    ${singleObject.instructor_first_name}
                                    ${singleObject.instructor_last_name}
                            </a>
                            <span
                                    class="material-symbols-outlined">double_arrow</span>
                    </div>
                    <div class="single_class_capacity grey">
                            <span class="material-symbols-outlined">groups</span>
                            Max ${singleObject.class_capacity} people
                    </div>
                    <div class="single_class_date grey">
                            <span class="material-symbols-outlined">event</span>
                            ${singleObject.date}
                    </div>
                    <div class="single_class_time grey">
                            <span class="material-symbols-outlined">schedule</span>
                            ${singleObject.class_time}
                    </div>
            </div>
            <div class="single_class_col col_right">
                    <div class="single_class_more_info grey">
                            <a class="hover-underline-animation"
                                    href="/class/${singleObject.class_id}"> More
                                    info
                                    <span
                                            class="material-symbols-outlined">double_arrow</span>
                            </a>
                    </div>
                    <div>
                            <div class="single_class_price">
                                    ${singleObject.class_price} DKK</div>
                            <div class="">
                                    ${singleObject.class_capacity - singleObject.reservations} spots left
                            </div>
                    </div>
                    <div id="basket" class="single_class_basket">
                            <span
                                    class="material-symbols-outlined">shopping_cart</span>
                            <span class="addToBasketBtnValue"> Add to basket</span>
                    </div>
            </div>
    </div>
</div > `;

}

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

let myInfo = document.querySelector(".my_info_col_wrapper");
let myInfoTop = document.querySelector(".my_info_top");
let myInfoCheckBox = document.querySelector("#my_info_checkbox");

let pastClassesCheckBox = document.querySelector("#past_classes_checkbox");
let pastClassesTop = document.querySelector(".past_classes_top");
let pastClassesContainer = document.querySelector(".past_classes_container");

let favInstrCheckBox = document.querySelector("#fav_instr_checkbox");
let favInstrTop = document.querySelector(".fav_instr_top");
let favInstructorsContainer = document.querySelector(".fav_instructors_container");

myInfoCheckBox.addEventListener('click', function () {
    myInfo.classList.toggle("hidden");
    myInfoTop.classList.toggle("active");
})

pastClassesCheckBox.addEventListener('click', function () {
    pastClassesContainer.classList.toggle("hidden");
    pastClassesTop.classList.toggle("active");
    fetchPastClasses();
})

favInstrCheckBox.addEventListener('click', function () {
    favInstructorsContainer.classList.toggle("hidden");
    favInstrTop.classList.toggle("active");
})


function fetchPastClasses() {
    let id = document.querySelector("#secretInfo").innerHTML;
    const response = fetch(`/user/${id}/past_classes`)
        .then(response => response.json())
        .then(fetchedData => {
            let pastClasses = fetchedData;
            pastClassesContainer.innerHTML = "";
            pastClasses.forEach(pastClass => {
                console.log("past:", pastClass);
                let classdate = moment(pastClass.class_date).format("DD.MM.YYYY")
                pastClassesContainer.innerHTML += `
                <div class="home_instr_upcom_class_cont">
                    <div class="home_instr_upcom_class_col_left">
                        <div class="upcoming_class_title">${pastClass.class_type} Yoga Class</div>
                        <div>${classdate}</div>
                    </div>
                    <div class="home_instr_upcom_class_col_right grey">
                        <div class="home_instr_location_link">
                            <span class="material-symbols-outlined pin_drop grey">pin_drop</span>
                            <span class="instructor_page_studio">
                                <a class="grey" href="">${pastClass.location_street} ${pastClass.location_building}, ${pastClass.location_zipcode}</a>
                            </span>
                        </div>
                    </div>
                </div>
            `;
            })
        })
}
