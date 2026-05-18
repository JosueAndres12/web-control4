<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nombre = htmlspecialchars($_POST['nombre']);
    $correo = htmlspecialchars($_POST['correo']);
    $mensaje = htmlspecialchars($_POST['mensaje']);

    $destino = "contacto@control4.mx"; // 🔥 CAMBIA A TU CORREO REAL

    $asunto = "Nuevo mensaje desde tu página web";

    $contenido = "
    Nombre: $nombre\n
    Correo: $correo\n
    Mensaje:\n$mensaje
    ";

    $headers = "From: $correo";

    if (mail($destino, $asunto, $contenido, $headers)) {
        echo "ok";
    } else {
        echo "error";
    }
}
?>