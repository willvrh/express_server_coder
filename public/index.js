const socket = io()

socket.on('products', data => {
    console.log("evento productos", data)
    loadList(data.payload)
})

socket.on('messagelog', data => {
    let p = document.getElementById("chatContainer")
    let messages = data.map((msg) => {
        return `<div><span><b style='color: blue'>${msg.email}</b> <span style='color: brown'>${msg.timestamp}</span>: <i style='color: green'>${msg.message}</i></span></div>`
    }).join('')
    p.innerHTML = messages
    scrollToBottom('chatContainer')
})

let input = document.getElementById("message")
let email = document.getElementById("email")
input.addEventListener('keyup', (e) => {
    if (e.key==="Enter" ) {
        if (!e.target.value) {
            Swal.fire({
                title: 'Error!',
                text: 'El mensaje se encuentra vacío',
                icon: 'error',
                confirmButtonText: 'Cool'
            })
            return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){
            Swal.fire({
                title: 'Error!',
                text: 'El email no es válido',
                icon: 'error',
                confirmButtonText: 'Cool'
            })
            return
        }
        socket.emit('message', {email: email.value, timestamp: new Date().toLocaleString(), message: e.target.value})
        input.value = ""
    }
})

function loadList(products) {
    fetch('http://localhost:8080/list_template.handlebars')
    .then(response => response.text().then(function(text) {
        let template = Handlebars.compile(text);
        document.querySelector("#listContainer").innerHTML = template({products: products});
      }))

   

}

document.addEventListener('submit', event=> {
    event.preventDefault()

    let form = document.querySelector('#productForm')
    fetch('http://localhost:8080/api/productos', {
        method: 'POST',
        body: new FormData(form)
    }).then(result => {
        return result.json()
    }).then(json => {
        if (json["status"]=="success") {
            alert("Se agregó el producto")
            //document.getElementById("thumbnail").value = "";
            document.getElementById("title").value = "";
            document.getElementById("price").value = "";
        }
    })
})

document.getElementById("image").onchange = (e)=>{
    let read = new FileReader();
    read.onload = e =>{
        //document.querySelector('.image-text').innerHTML = "Vista previa del producto"
        document.getElementById("preview").src = e.target.result;
    }
    
    read.readAsDataURL(e.target.files[0])
}

function scrollToBottom (id) {
    var div = document.getElementById(id);
    div.scrollTop = div.scrollHeight - div.clientHeight;
 }

 function validateEmail(mail) {
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    return (false)
}