
document.querySelector("#show_users").addEventListener('click', ()=> {

    console.log("button clicked");

    fetch ('/users/test')
        .then((response)=> {
            return response.json();
        })
        .then((data) =>{
            console.log(data);

            let usersContainer = document.querySelector("#users")
            let div = document.createElement("div");
            div.innerHTML = 'Name: ' + data[0].userFirstName + '\n' + data[0].userLastName;
            usersContainer.appendChild(div);

        })
        .catch((error) => {
            throw err;
        })

});

