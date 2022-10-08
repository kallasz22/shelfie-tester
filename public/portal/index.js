fetch('/load')
    .then(function (response) {
        if (response.redirected) {
            window.location.replace(response.url);
        } else {
            return response.json();
        }
    })
    .then(function (user) {
        document.querySelector('#user').innerText = user.username;

        for (let i = 0; i < user.houses.length; i++) {
            const house = user.houses[i];

            // let p = document.createElement('p');
            // p.classList = 'house';
            // p.innerText = house.name;
            // document.querySelector('body').append(p);

            // let houseElement = document.createElement('details');
            // houseElement.classList = 'house';
            // houseElement.innerHTML = `<summary>${house.name}</summary>`;
            // houseElement.setAttribute('open', 'open');
            // document.querySelector('body').append(houseElement);

            let nr_house = document.createElement('option');
            nr_house.innerText = house.name;
            document.querySelector('#nr_house').append(nr_house);
            
            let ns_house = document.createElement('option');
            ns_house.innerText = house.name;
            document.querySelector('#ns_house').append(ns_house);

            let nb_house = document.createElement('option');
            nb_house.innerText = house.name;
            document.querySelector('#nb_house').append(nb_house);

            for (let j = 0; j < house.rooms.length; j++) {
                const room = house.rooms[j];

                // let p = document.createElement('p');
                // p.classList = 'room';
                // p.innerText = room.name;
                // document.querySelector('body').append(p);

                // let roomElement = document.createElement('details');
                // roomElement.classList = 'room';
                // roomElement.innerHTML = `<summary>${room.name}</summary>`;
                // roomElement.setAttribute('open', 'open');
                // houseElement.append(roomElement);

                let ns_room = document.createElement('option');
                ns_room.innerText = room.name;
                ns_room.id = house.name;
                document.querySelector('#ns_room').append(ns_room);

                let nb_room = document.createElement('option');
                nb_room.innerText = room.name;
                nb_room.id = house.name;
                document.querySelector('#nb_room').append(nb_room);

                for (let h = 0; h < room.shelfs.length; h++) {
                    const shelf = room.shelfs[h];

                    // let p = document.createElement('p');
                    // p.classList = 'shelf';
                    // p.innerText = shelf.name;
                    // document.querySelector('body').append(p);

                    // let shelfElement = document.createElement('details');
                    // shelfElement.classList = 'shelf';
                    // shelfElement.innerHTML = `<summary>${shelf.name}</summary>`;
                    // shelfElement.setAttribute('open', 'open');
                    // roomElement.append(shelfElement);

                    let nb_shelf = document.createElement('option');
                    nb_shelf.id = room.name;
                    nb_shelf.innerText = shelf.name;
                    document.querySelector('#nb_shelf').append(nb_shelf);
                }
            }
        }

        /*for (let i = 0; i < user.books.length; i++) {
            const book = user.books[i];

            // console.log(document.querySelectorAll('details'));
            let j = 0;
            while (j < document.querySelectorAll('details').length && document.querySelectorAll('details')[j].classList != 'house' || document.querySelectorAll('details')[j].children[0].innerText != book.house) {//...length-1?
                j++;
            }

            let findedHouse = document.querySelectorAll('details')[j];
            // console.log(findedHouse);
            // console.log('talált details: ', document.querySelectorAll('details')[j]);

            let k = 0;
            while (k < findedHouse.children.length-1 && (findedHouse.children[k].classList != 'room' || findedHouse.children[k].innerText != book.room)) {
                k++;
            }

            // console.log('findedHouse.children[k]: ', findedHouse.children[k]);

            let findedRoom = findedHouse.children[k];

            let l = 0;
            while (l < findedRoom.children.length-1 && (findedRoom.children[l].classList != 'shelf' || findedRoom.children[l].innerText != book.shelf)) {
                l++;
            }

            let findedShelf = findedRoom.children[l];

            let p = document.createElement('p');
            p.innerText = book.title;
            findedShelf.append(p);

            // console.log('findedRoom.children[l]', findedRoom.children[l]);
        }*/

        for (let i = 0; i < user.books.length; i++) {
            const book = user.books[i];

            // console.log(book._id);
            
            let details = document.createElement('details');
            details.innerHTML = 
            `<summary>${book.title}</summary>
            <p>Writer: ${book.writer}</p>
            <p>Title: ${book.title}</p>
            <p>Description: ${book.description}</p>
            <p>Type: ${book.type}</p>
            <p>Publisher: ${book.publisher}</p>
            <p>Year of publication: ${book.yearOfPublication}</p>
            <p>Notes: ${book.notes}</p>
            <p>Place: ${book.house} > ${book.room} > ${book.shelf}</p>
            <p>Pinned: ${book.pinned}</p>

            
            <div>
                <button class="delete">Delete</button>
            </div>
            `;
            details.id = book._id;
            document.querySelector('body').append(details);
        }

        houseroomrelation('ns');
        houseroomrelation('nb');
        roomshelfrelation('nb');
    })
    .then(function(){
        for (let i = 0; i < document.querySelectorAll('.delete').length; i++) {
            const element = document.querySelectorAll('.delete')[i];
            // console.log(element);
            element.addEventListener('click', function(){
                // let hr = new XMLHttpRequest();
                // hr.open('POST', '/delete-book');
                // let formData = new FormData();
                // formData.append('objectID', element.id);
                // hr.send(formData);
                // console.log('some-code');
        
                // let objectID = {
                //     objectID: element.id
                // };


                // console.log(element.parentElement.parentElement.id);
        
                // fetch('/delete-book', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'text/plain;charset=utf-8'
                //     },
                //     body: JSON.stringify({objectID: element.parentElement.parentElement.id})
                // })
                // .then(function(response){
                //     console.log(response);
                //     if (response.redirected) {
                //         window.location.replace(response.url);
                //     } else {
                //         return response.json();
                //     }
                // });

                // let xhttp = new XMLHttpRequest();
                // xhttp.open('POST', '/delete-book', true);
                // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                // xhttp.send(`objectID=${element.parentElement.parentElement.id}`);
                // // console.log('JSON.stringify({objectID: element.parentElement.parentElement.id}): ', JSON.stringify({objectID: element.parentElement.parentElement.id}));
                // xhttp.onreadystatechange = function(){
                //     console.log(xhttp.response);
                //     if (xhttp.response.redirected) {
                //         window.location.replace(xhttp.response.url);
                //     }
                // }

                fetch('/delete-book', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `objectID=${element.parentElement.parentElement.id}`
                })
                .then(function(response){
                    // console.log(response);
                    if (response.redirected) {
                        window.location.replace(response.url);
                    } else {
                        return response.json();
                    }
                });
            
            });
        }
    });

document.querySelector('#ns_house').addEventListener('change', function(){houseroomrelation('ns')});
document.querySelector('#nb_house').addEventListener('change', function(){houseroomrelation('nb'); roomshelfrelation('nb')});
document.querySelector('#nb_room').addEventListener('change', function(){roomshelfrelation('nb')});

function houseroomrelation(which) {
    let db = 0;
    let first_good_room = '';

    for (let i = 0; i < document.querySelector(`#${which}_room`).children.length; i++) {
        const option = document.querySelector(`#${which}_room`).children[i];
        if (option.id == document.querySelector(`#${which}_house`).value) {
            option.style.display = 'block';
            if (first_good_room == '') {
                first_good_room = option.value;
            }
        }
        else{
            option.style.display = 'none';
            db++;
        }
    }

    if (db == document.querySelector(`#${which}_room`).children.length) {
        document.querySelector(`#${which}_room`).value = "NO ITEM";//doesnt work
        document.querySelector(`#${which}_room`).disabled = true;  
        document.querySelector(`#${which}_add`).disabled = true;  
        
    }else{
        document.querySelector(`#${which}_room`).value = first_good_room;
        document.querySelector(`#${which}_room`).disabled = false;
        document.querySelector(`#${which}_add`).disabled = false;  
    }
}

function roomshelfrelation(which) {
    let db = 0;
    let first_good_shelf = '';

    for (let i = 0; i < document.querySelector(`#${which}_shelf`).children.length; i++) {
        const option = document.querySelector(`#${which}_shelf`).children[i];
        if (option.id == document.querySelector(`#${which}_room`).value) {
            option.style.display = 'block';
            if (first_good_shelf == '') {
                first_good_shelf = option.value;
            }
        }
        else{
            option.style.display = 'none';
            db++;
        }
    }

    if (db == document.querySelector(`#${which}_shelf`).children.length) {
        document.querySelector(`#${which}_shelf`).value = "NO ITEM";//doesnt work
        document.querySelector(`#${which}_shelf`).disabled = true;  
        document.querySelector(`#${which}_add`).disabled = true;  
        
    }else{
        document.querySelector(`#${which}_shelf`).value = first_good_shelf;
        document.querySelector(`#${which}_shelf`).disabled = false;
        document.querySelector(`#${which}_add`).disabled = false;  
    }
}

document.querySelector('#new-house-button').addEventListener('click', function () {
    document.querySelector('#dialog-bg').style.display = 'flex';
    document.querySelector('#new-house').style.display = 'flex';
});

document.querySelector('#new-room-button').addEventListener('click', function () {
    document.querySelector('#dialog-bg').style.display = 'flex';
    document.querySelector('#new-room').style.display = 'flex';
});

document.querySelector('#new-shelf-button').addEventListener('click', function () {
    document.querySelector('#dialog-bg').style.display = 'flex';
    document.querySelector('#new-shelf').style.display = 'flex';
});

document.querySelector('#new-book-button').addEventListener('click', function () {
    document.querySelector('#dialog-bg').style.display = 'flex';
    document.querySelector('#new-book').style.display = 'flex';
});


