// web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCJ63RHBc0LMxSKn3mCubjeGpAqXtcdG_Q",
    authDomain: "ciyn-7bfbc.firebaseapp.com",
    databaseURL: "https://ciyn-7bfbc.firebaseio.com",
    projectId: "ciyn-7bfbc",
    storageBucket: "ciyn-7bfbc.appspot.com",
    messagingSenderId: "251105086649",
    appId: "1:251105086649:web:ada3d55a17def3c0b7df68",
    measurementId: "G-4N9321T8ST"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.firestore();
const usersCollection = database.collection('user');
console.log(usersCollection);

var profile;
var user_id;
var user_name;
var user_image;
var user_email;
var is_ewhain;
var size;
var check_flag;

// 데이터베이스에 사용자가 있는지 확인
function check_user() {
    console.log("check user 실행중");
    console.log(usersCollection.where('email', '==',user_email));
    var user_where = usersCollection.where('email', '==',user_email);
    console.log(user_where);
    
    user_where.get().then(function(querySnapshot){
        console.log(querySnapshot);
        if(querySnapshot.empty){
            console.log("비었다");
            check_flag = 0;
            console.log(check_flag);
        }
        else{
            console.log("안비었다.");
            check_flag =  1;
            console.log(check_flag);
        }
    })

    console.log(check_flag);
    return check_flag;
 
}

// 로그인 함수
function onSignIn(googleUser) {
    profile = googleUser.getBasicProfile();
    id_token = googleUser.getAuthResponse().id_token;

    user_id = profile.getId();
    user_name = profile.getName();
    user_image = profile.getImageUrl();
    user_email = profile.getEmail();
    user_email.href = user_email;

    // 이화인 메일인지 확인
    var findString = "ewhain.net";
    user_email = String(user_email);

    if (user_email.indexOf(findString) != -1) {
        is_ewhain = "이화인 계정입니다.";
    }
    else {
        is_ewhain = "이화인 계정이 아닙니다. 이화인 계정으로 로그인하세요.";
    }

    sessionStorage.setItem('user_email', user_email);

    console.log('ID: ' + user_id); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + user_name);
    console.log('Image URL: ' + user_image);
    console.log('Email: ' + user_email); // This is null if the 'email' scope is not present.

    document.getElementById("user_name").innerHTML = user_name;
    document.getElementById("user_email").innerHTML = user_email;
    document.getElementById("is_ewhain").innerHTML = is_ewhain;
    ///////////////////////////////

    $.ajax({
        type: 'POST',
        url: 'http://example.com/storeauthcode',
        processData: false,
        data: id_token,
        contentType: 'application/octet-stream; charset=utf-8',
        success: function (result) {
            // Handle or verify the server response if necessary.
            if (result) {
                $('#result').html('Login Successful!</br>' + result + '</br>Redirecting...')
                setTimeout(function () {
                    window.location.href = "/";
                }, 3000);

            } else if (authResult['error']) {
                console.log('There was an error: ' + authResult['error']);
            } else {
                $('#result').html('Failed to make a server-side call. Check your configuration and console.');
            }
        }

    })

    var check = check_user();

    console.log(check);
    var size;

    // Database에 User가 없는경우, email을 Database에 추가
    if (check===0) {
        console.log("디비에없는경우");
        var docData = {
            'email': user_email,
            'name':user_name
        };

    
        usersCollection.get().then(snap => {
            size = snap.size + 1;
            console.log(size);
            console.log(snap.size);
        });

        console.log(size);
 
        var user_number = "user" + String(8);
        console.log(user_number);

        database.collection("user").doc(user_number).set(docData).then(function () {
            console.log("Document successfully written!");
        });
    }
}

function get_name() {
    //onSignIn(googleUser);
    console.log('ID: ' + user_id); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + user_name);
    console.log('Image URL: ' + user_image);
    console.log('Email: ' + user_email); // This is null if the 'email' scope is not present.

    document.getElementById("user_name").innerHTML = user_name;
    document.getElementById("user_email").innerHTML = user_email;
    document.getElementById("is_ewhain").innerHTML = is_ewhain;
}

// 로그아웃
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        $.ajax({
            type: 'POST',
            url: '/googledisconnect',
            processData: false,
            contentType: 'application/octet-stream; charset=utf-8',
            success: function (result) {
                // Handle or verify the server response if necessary.
                if (result) {
                    $('#resultout').html('Logout Successful!</br>' + result + '</br>Redirecting...')
                    setTimeout(function () {
                        window.location.href = "/";
                    }, 3000);

                } else {
                    $('#resultout').html('Failed to make a server-side call. Check your configuration and console.');
                }
            }
        })
    });
}


