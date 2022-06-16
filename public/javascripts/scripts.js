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
                        console.log("single object:", singleObject);
                        showClassesOverview(singleObject);
                    })
                })
        }
        updateClassList();

    });
})

function showClassesOverview(singleObject) {
    let classdate = moment(singleObject.class_date).format("DD.MM.YYYY");
    let spotsLeft = parseInt(singleObject.class_capacity) - parseInt(singleObject.reservations);
    console.log("map: ", singleObject.location_map);
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
                            <span class="googleLocation" style="display:none">${singleObject.location_map}</span>
                    </div>
                    <div
                            class="single_class_instructor grey hover-underline-animation">
                            <a class="single_class_instructor grey" href="/instructor/${singleObject.instructor_id}"
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
                            ${classdate}
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
                                    ${spotsLeft} spots left
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
    showMap();

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

function showMap() {

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
}
showMap();




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


function fetchNextClasses() {
    let id = document.querySelector("#secretInfoHomeUser").innerHTML;
    const response = fetch(`/user/${id}/next_classes`)
        .then(response => response.json())
        .then(fetchedData => {
            let nextClasses = fetchedData;
            console.log("next classes:", nextClasses);
            let nextClassesContainer = document.querySelector(".nextClassesContainer");
            document.querySelector("#nextClassesCount").innerText = nextClasses.length;
            nextClassesContainer.innerHTML = "";
            nextClasses.forEach(nextClass => {
                console.log("next:", nextClass);
                let classdate = moment(nextClass.class_date).format("DD.MM.YYYY")
                nextClassesContainer.innerHTML += `
            <div class="home_instr_upcom_class_cont">
                <div class="home_instr_upcom_class_col_left">
                    <div class="upcoming_class_title"> ${nextClass.class_type} </div>
                    <div>${classdate}</div>
                    <div>${nextClass.class_time}</div>
                </div>
                <div class="home_instr_upcom_class_col_right grey">
                <div class="single_class_more_info grey">
                    <a class="hover-underline-animation" href="/class/${nextClass.class_id}">
                    More info
                        <span class="material-symbols-outlined">double_arrow</span>
                    </a>
                </div>
                    <div class="home_instr_location_link">
                        <span class="material-symbols-outlined pin_drop grey">pin_drop</span>
                        <span class="instructor_page_studio">
                            ${nextClass.location_street} ${nextClass.location_building}, ${nextClass.location_zipcode}
                        </span>
                    </div>
                </div>
            </div>
        `;
            })
        })
}
fetchNextClasses();




function fetchDiscounts() {
    const response = fetch('/discounts')
        .then(response => response.json())
        .then(discountsData => {
            let discounts = discountsData;
            console.log(discounts);
            let discountsContainer = document.querySelector(".last_offers_container");
            discountsContainer.innerHTML = "";
            discounts.forEach(offer => {
                console.log("offer:", offer);
                let offerdate = moment(offer.class_date).format("DD.MM.YYYY")
                discountsContainer.innerHTML += `
            <div class="single_offer_wrapper">
            <div class="last_offer_title"> ${offer.class_type} yoga </div> 
            <div class="last_offer_info">

                <div class="last_offer_col_left">
                    <div>${offerdate}</div>
                    <div>${offer.class_time}</div>
                </div>

                <div class="last_offer_col_right">
                    <div class="old_price grey">${offer.class_price}DKK</div>
                    <div class="new_price">${offer.class_new_price}DKK</div>
                </div>
            </div>
            <div class="single_class_more_info grey">
            <a class="hover-underline-animation" href="/class/${offer.class_id}">
            More info
                <span class="material-symbols-outlined">double_arrow</span>
            </a>
        </div>
        </div>
    `;
            })
        })
}

fetchDiscounts();


function showLogOutBtn() {
    let div = document.querySelector("#dropdown_menu");
    document.querySelector("#my_profile_icon").addEventListener("click", () => {
        div.classList.toggle("hidden");
    })
}

showLogOutBtn();