<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
require_once "config.php";
$output = array();
$request_body = file_get_contents('php://input');
$request = json_decode($request_body);
if (isset($request->todo)) {
    $item = filter_var($request->todo, FILTER_SANITIZE_STRING);
    if (!empty($item)) {
        $insert = mysqli_query($con, "INSERT INTO todo (item,todoStatu) VALUES ('$item',1)");
        if (isset($insert)) {
            $query = mysqli_query($con, "SELECT * from todo WHERE todoStatu=1");
            while ($data = mysqli_fetch_object($query)) {
                $output["todos"][] = $data;
            }
            $query = mysqli_query($con, "SELECT * from todo WHERE todoStatu=2");
            while ($data = mysqli_fetch_object($query)) {
                $output["completed"][] = $data;
            }
        } else {
            $output['msg'] = "error cannot execute query ";

        }

    }

} elseif (isset($request->delete)) {
    $id = filter_var($request->delete, FILTER_VALIDATE_INT);
    $deleted = mysqli_query($con, "DELETE FROM todo WHERE id = $id");
    if ($deleted) {
        $query = mysqli_query($con, "SELECT * from todo WHERE todoStatu=1");
        while ($data = mysqli_fetch_object($query)) {
            $output["todos"][] = $data;
        }
        $query = mysqli_query($con, "SELECT * from todo WHERE todoStatu=2");
        while ($data = mysqli_fetch_object($query)) {
            $output["completed"][] = $data;
        }
    }
} else {

    $query = mysqli_query($con, "SELECT * from todo WHERE todoStatu=1");
    while ($data = mysqli_fetch_object($query)) {
        $output["todos"][] = $data;
    }
    $query = mysqli_query($con, "SELECT * from todo WHERE todoStatu=2");
    while ($data = mysqli_fetch_object($query)) {
        $output["completed"][] = $data;
    }
}

echo json_encode($output, JSON_PRETTY_PRINT);

mysqli_close($con);
