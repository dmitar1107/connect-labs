<?php

error_reporting(0);
set_time_limit(300);

/*
  Sean Huber CURL library

  This library is a basic implementation of CURL capabilities.
  It works in most modern versions of IE and FF.

  ==================================== USAGE ====================================
  It exports the CURL object globally, so set a callback with setCallback($func).
  (Use setCallback(array('class_name', 'func_name')) to set a callback as a func
  that lies within a different class)
  Then use one of the CURL request methods:

  get($url);
  post($url, $vars); vars is a urlencoded string in query string format.

  Your callback function will then be called with 1 argument, the response text.
  If a callback is not defined, your request will return the response text.
 */

class CURL {

        var $callback = false;

        function setCallback($func_name) {
                $this->callback = $func_name;
        }

        function doRequest($method, $url, $vars, $headers = false) {
				$fields_string = "";
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_VERBOSE, 1);
                curl_setopt($ch, CURLOPT_HEADER, 1);
                curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_TIMEOUT, 280);
                if ($headers) {
                        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
                }
                if ($method == 'POST') {
                        foreach ($vars as $key => $value) {
                                $fields_string .= $key . '=' . $value . '&';
                        }
                        $fields_string = rtrim($fields_string, '&');
                        curl_setopt($ch, CURLOPT_POST, 1);
                        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
                }elseif($method =='PUT'){
                   foreach ($vars as $key => $value) {
                                $fields_string .= $key . '=' . $value . '&';
                        }
                        $fields_string = rtrim($fields_string, '&');
                  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
                  curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
                  
                }
                $data = curl_exec($ch);
                $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
                $this->full_response = $data;
				$this->error= curl_error($ch);
                $this->body = substr($data, $header_size);
                $this->headerArray = $this->get_headers_from_curl_response();
                curl_close($ch);
                if ($data) {
                        if ($this->callback) {
                                $callback = $this->callback;
                                $this->callback = false;
                                return call_user_func($callback, $data);
                        } else {
                                return $data;
                        }
                } else {
                        return curl_error($ch);
                }
        }

        function get($url, $headers = array()) {
                return $this->doRequest('GET', $url, 'NULL', $headers);
        }

        function post($url, $vars, $headers = array()) {
                return $this->doRequest('POST', $url, $vars, $headers);
        }

        function get_headers_from_curl_response() {
                $headers = array();
                $response = $this->full_response;
                $header_text = substr($response, 0, strpos($response, "\r\n\r\n"));

                foreach (explode("\r\n", $header_text) as $i => $line)
                        if ($i === 0)
                                $headers['http_code'] = $line;
                        else {
                                list ($key, $value) = explode(': ', $line);

                                $headers[$key] = $value;
                        }

                return $headers;
        }

}

$domain = $_SERVER['SERVER_NAME'];
if (strpos($domain, 'local.') !== false) {
        $url = 'http://local.connect.com/api.connect.com/index.php/api/' . $_POST['endpoint'];
} elseif (strpos($domain, 'staging.') !== false) {
        $url = 'http://staging-api.connect.com/index.php/api/' . $_POST['endpoint'];
} else {
        $url = 'http://api.connect.com/index.php/api/' . $_POST['endpoint'];
}
//echo print_r($_POST);
//echo $url;
$method = $_POST['method'];
$vars = $_POST['vars'];
$headers = $_POST['headers'];
$curl = new CURL;
$curl->doRequest($method, $url, $vars, $headers);
//echo $curl->error;
header($curl->headerArray['http_code']);
header('Content-type: application/json');
echo $curl->body;
?>

