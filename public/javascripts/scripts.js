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

document.querySelector("#show_classes_btn").addEventListener('click', show_classes);

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


// async function test() {
//     const response = await fetch(`/parameters/*`);
//     console.log(response);
// }

// array with selected checkboxes 
let array = [];
var checkboxes = document.querySelectorAll(".checkbox");


checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {

        if (checkbox.checked == true) {
            array.push({ key: checkbox.dataset.key, value: checkbox.dataset.value });
        } else {
            array = array.filter(a => a.value !== checkbox.dataset.value);
        }
        console.log(array);

        let url = new URL(window.location.href+'/classes/');

        if (url.searchParams) {

            for (var key of url.searchParams.keys()) {
                url.searchParams.delete(key);

            }
        }

        array.forEach(arrayItem => {
            url.searchParams.append(arrayItem.key, arrayItem.value);

        })


        console.log(url);


        function updateClassList() {

            query = url;
            // const response = await fetch(`/index/classes/${query}`)
            const response = fetch(url)
            .then(response => response.json())
            .then(data => classes = data);
            
            document.querySelector("#classes").innerHTML = classes;
        }
        updateClassList();

    });
})

















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
