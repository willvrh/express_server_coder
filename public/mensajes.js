const socket = io()

socket.on('messagelog', normalizedData => {
    

    const authors = new normalizr.schema.Entity('authors');
    const messages = new normalizr.schema.Entity('messages', {
        author: authors
    });
    const parent = new normalizr.schema.Entity('parent', {
        messages: [messages]
        });

    const denormalizedData = normalizr.denormalize(normalizedData.payload.result, parent, normalizedData.payload.entities)    
    let compressionPercent = 100-(JSON.stringify(normalizedData.payload).length*100)/JSON.stringify(denormalizedData).length;
    
    
    let p = document.getElementById("chatContainer")
    let e = document.getElementById("comp")
    compressionPercent = compressionPercent.toFixed(2)<0? 0:compressionPercent.toFixed(2)
    e.innerHTML = "("+compressionPercent+"% de compresión)"

    
    try {
        let messagesHtml = denormalizedData.messages.map((msg) => {
                return `<div class="mb-2 bg-light"><img src="${msg.author.avatar}" alt="Avatar" class="avatar"><b style='color: blue'>${msg.author.id}</b> <span style='color: brown'>${msg.created_at}</span>: <br><i class="ml-2"style='color: green'>${msg.text}</i></div>`
            }).join('')
        p.innerHTML = messagesHtml
        scrollToBottom('chatContainer')
    }catch (e) {
        console.log("error "+e)
    }

})

let input = document.getElementById("message")
let email = document.getElementById("email")
let first_name = document.getElementById("first_name")
let last_name = document.getElementById("last_name")
let age = document.getElementById("age")
let alias = document.getElementById("alias")
input.addEventListener('keyup', (e) => {
    if (e.key==="Enter" ) {
        if (!first_name.value) {
            Swal.fire({
                title: 'Error!',
                text: 'El nombre se encuentra vacío',
                icon: 'error',
                confirmButtonText: 'Cool'
            })
            return
        }
        if (!last_name.value) {
            Swal.fire({
                title: 'Error!',
                text: 'El apellido se encuentra vacío',
                icon: 'error',
                confirmButtonText: 'Cool'
            })
            return
        }
        if (!alias.value) {
            Swal.fire({
                title: 'Error!',
                text: 'El alias se encuentra vacío',
                icon: 'error',
                confirmButtonText: 'Cool'
            })
            return
        }
        if (!age.value) {
            Swal.fire({
                title: 'Error!',
                text: 'La edad se encuentra vacía',
                icon: 'error',
                confirmButtonText: 'Cool'
            })
            return
        }
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
        socket.emit('message', {

            author: {
                id: email.value,
                nombre: first_name.value,
                apellido: last_name.value,
                edad: age.value,
                alias: alias.value,
                avatar: "https://image.pngaaa.com/83/5311083-middle.png"
            },
            text: e.target.value
        })
        input.value = ""
    }
})


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