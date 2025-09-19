fetch('http://backend:5000/api')
    .then(response => response.text())
    .then(data => {
        document.getElementById('response').textContent = data;
    });