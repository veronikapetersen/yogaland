document.querySelector("#show_users").addEventListener('click', show_users);

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
