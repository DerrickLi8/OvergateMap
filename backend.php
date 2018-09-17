<!DOCTYPE html>
<html>
<body>

<?php
include 'db.php';

//function to open connection to access db
function openConnection(){
    try{
        $conn = connect();
    }
    catch(PDOException $e)
    {
        echo "error: ".$e->getMessage();
    }
    return $conn;
}

function closeConnection($q, $stmt, $conn){
    $q = null;
    $stmt = null;
    $conn = null;
}

//functions for handling database through stored procedures

//same as getWithStoredProcedure but it doesn`t have to reutrn data
function setWithStoredProcedure($proc){  
    try{
        $con = openConnection();
        $stmt = $con->prepare($proc, $array);
        $stmt->execute();
        echo "success";
        closeConnection($r, $stmt, $con);
        }
    catch(PDOException $e)
        {
            echo "error: ".$e->getMessage();
        }
}


//function to create call for stored procedure

//pass in call through $proc and pass in array of keys you want to get with $array
//eg: $proc = "call storesSelectByID($o);" (where $o can be an interger), $array = ("StoreName", "StoreID")
//returns an array with key-value pairs where keys are the keys passed in with $array
function getWithStoredProcedure($proc, $array){
    try{
        $con = openConnection();
        $stmt = $con->prepare($proc, $array);
        $stmt->execute();
        $r = $stmt->fetchAll();
        $to_return = array();
        foreach($r as $res){
            foreach($array as $key){
                if(array_key_exists($key, $res)){
                    $to_return[$key] = $res[$key];
                }
            }
        }
        return $to_return;
    closeConnection($r, $stmt, $con);
    }
    catch(PDOException $e)
    {
        echo "error: ".$e->getMessage();
    }
}

$array = array('StoreName', 'StoreID');
$other_array = array(2, 3, 4);
foreach($other_array as $o){
    $r = $ret_array = getWithStoredProcedure("call storesSelectByID($o);", $array);
    echo $r['StoreName'];
}






?>

</body>
</html> 