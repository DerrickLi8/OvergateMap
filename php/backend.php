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

function closeConnectionForSet($stmt, $conn){
    $stmt = null;
    $conn = null;
}

//functions for handling database through stored procedures

function setWithStoredProcedure($proc){  
    try{
        $con = openConnection();
        $stmt = $con->prepare($proc);
        $stmt->execute();
        closeConnectionForSet($stmt, $con);
        }
    catch(PDOException $e)
        {
            echo "error: ".$e->getMessage();
        }
}

function getWithStoredProcedure($proc, $array){
    try{
        $con = openConnection();
        $stmt = $con->prepare($proc, $array);
        $stmt->execute();
        $r = $stmt->fetchAll();
        $to_return = array();
        foreach($r as $res){
            //var_dump($res);
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

//$array = array('StoreName', 'StoreID');
//$other_array = array(2, 3, 4);
//foreach($other_array as $o){
//    $r = $ret_array = getWithStoredProcedure("call storesSelectByID($o);", $array);
//    echo $r['StoreName'];
//}






?>