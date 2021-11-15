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
            document.getElementById("thumbnail").value = "";
            document.getElementById("title").value = "";
            document.getElementById("price").value = "";
        }
    })
})