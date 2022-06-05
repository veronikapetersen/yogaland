// document.querySelector("#show_users").addEventListener('click', show_users);

async function show_users() {
    try {
        const response = await fetch(`/show_data`)
            .then(response => response.json())
            .then(data => data_obj = data);
        document.querySelector("#users").innerHTML = data_obj;
    }
    catch (err) {
        console.error(err);
    }
}

// document.querySelector("#show_classes_btn").addEventListener('click', show_classes);

async function show_classes() {
    try {
        const response = await fetch(`/classes`)
            .then(response => response.json())
            .then(data => classes = data);
        document.querySelector("#classes").innerHTML = classes;
    }
    catch (err) {
        console.error(err);
    }
}

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
                        document.querySelector("#classes").innerHTML += `
                        <div class="single_class_container">
                            <div class="single_class_top">
                              
                            </div>

                            <div class="single_class_wrapper">

                                <div class="single_class_col col_left">
                                    <div>
                                        <img class="single_class_thumbnail" src="/images/pexels-andrea-piacquadio-3757955.jpg" alt="yoga_class">
                                    </div>
                                    <div class="single_class_duration grey">
                                        <span class="material-symbols-outlined">timer</span> 
                                            ${singleObject.class_duration} min
                                    </div>
                                    <div class="">1.2 km away</div>
                                    
                                </div>

                                <div class="single_class_col col_mid">
                                    <div class="single_class_title">${singleObject.class_type} Yoga class 🇺🇸 🇩🇰 </div>
                                    <div class="single_class_location grey">
                                        <span class="material-symbols-outlined">pin_drop</span>
                                        ${singleObject.location_street} ${singleObject.location_building}, ${singleObject.location_zipcode}
                                    </div>
                                    <div class="single_class_instructor grey hover-underline-animation">
                                        <span class="material-symbols-outlined">self_improvement</span>
                                        ${singleObject.instructor_first_name} 
                                        ${singleObject.instructor_last_name} 
                                    </div>
                                    <div class="single_class_capacity grey">
                                        <span class="material-symbols-outlined">groups</span>
                                        Max ${singleObject.class_capacity} people
                                    </div>
                                    <div class="single_class_date grey">
                                        <span class="material-symbols-outlined">event</span>
                                        ${singleObject.class_date}
                                    </div>
                                    <div class="single_class_time grey">
                                        <span class="material-symbols-outlined">schedule</span>
                                        ${singleObject.class_time}
                                    </div>
                                </div>
                                
                                <div class="single_class_col col_right">
                                    <div class="single_class_more_info grey">
                                        <a class="hover-underline-animation" href="/class/id/${singleObject.class_id}">More info 
                                            <span class="material-symbols-outlined">double_arrow</span>
                                        </a>
                                    </div>
                                    <div>
                                        <div class="single_class_price">${singleObject.class_price} DKK</div>
                                        <div class="">3 spots left</div>
                                        
                                    </div>
                                    
                                    <div id="basket" class="single_class_basket">
                                    <span class="material-symbols-outlined">shopping_cart</span>Add to basket
                                    </div>
                            
                                </div>
                                
                            </div>
                          
                        </div>
                        `;
                    })
                }
                );
        }
        updateClassList();

    });
})


// function showSingleClass() {
//     console.log("yes");
//     const response = fetch(`/class/id/${id}`)
//     .then(response => response.json())
//     .then(data => singleClassInfo = data)
//     console.log(singleClassInfo);
// }

// showSingleClass();



// document.querySelector("#user").innerHTML = data[0].user_first_name;
// document.querySelector("#show_users").addEventListener('click', ()=> {
//     console.log("button clicked");
//     fetch ('/users/test')
//         .then((response)=> {
//             return response.json();
//         })
//         .then((data) =>{
//             console.log(data);
//             let usersContainer = document.querySelector("#users")
//             usersContainer.innerHTML = 'Name: ' + data[0].user_first_name + '\n' + data[0].user_last_name;
//             // usersContainer.appendChild(div);
//         })
//         .catch((err) => {
//             throw err;
//         })
// });
