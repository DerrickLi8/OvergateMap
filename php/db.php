<?php


function connect(){
    $servername = "silva.computing.dundee.ac.uk";
    $username = "18indteam5";
    $password = "8433.it5.3348";
    $dbname = "18indteam5db";
    try{
        $conn = new PDO("mysql:host=$servername;dbname=$dbname;", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $conn;
    }
    catch(PDOException $e)
    {
        echo "connection failed: ".$e->getMessage();
    }
}

/*
function connect(){
    $servername = "silva.computing.dundee.ac.uk";
    $username = "18indteam5";
    $password = "8433.it5.3348";
    $dbname = "18indteam5db";

    $conn = new mysqli($servername, $username, $password);
    if ($conn->connect_error){
        die("connection failed: ". $conn->connect_error);
    }
    return $conn;
}
*/
?>