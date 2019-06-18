// setup:
'use strict';
const port = 3000;
const express = require('express');
const app = express();
//const jwt = require('jsonwebtoken');
//const jwt_secret = "secret";
const json_body_parser = require('body-parser').json();

app.use(json_body_parser);

// Fake JWTs:
const admin_jwt = 'admin';
const testuser1_jwt = '1';

/*
 * Initial state:
 *      Admin: can manage everything
 *              UserID: 0000001
 *              LoginName: admin
 *              username: admin
 *              Password: password
 *      User: just a regular user
 *              UserID: 0000003
 *              LoginName: testuser1
 *              username: testuser1
 *              Password: password
 *              Created: Jan 1, 2019
 *              Horoscope: Leo
 *              Log: 1
 *              Birthday: July 27, 2015
 *              Base: 001
 *              
 *              UserID: 0000004
 *              LoginName: testuser2
 *              username: testuser2
 *              Password: password
 *              Created: December 31, 2018
 *              Horoscope: Libra
 *              Log: 10
 *              Birthday: Sept 23, 1987
 *              Base: 002
 *              
 *              pH between user1 and user2: 8
 *              
 *              UserID: 0000005
 *              username: wrongpasswordtest
 *              Password: (null) -- any password given will be treated as wrong
 *              other information: omitted
 *              
 *      
 *      Base:
 *              BaseID: 001
 *              Name: Double Bass
 *              PictureURL: https://upload.wikimedia.org/wikipedia/commons/d/d3/AGK_bass1_full.jpg
 *              Description: Melodious and smooth.
 *              
 *              BaseID: 002
 *              Name: Octobass
 *              PictureUrl: https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Octobasse_Orchestre_Symphonique_de_Montr%C3%A9al_Eric_Chappell_1.jpg/220px-Octobasse_Orchestre_Symphonique_de_Montr%C3%A9al_Eric_Chappell_1.jpg
 *              Description: Made in Paris.
 *              
 *              
 *      ChatSession:
 *              ChatSessionID: 000001
 *              Title: the amazing chat session
 *              CreationTimeStamp: Jan 1, 2019, 00:00
 *              Participants: users 000003, 000004
 *      
 *      ChatMessage:
 *              ChatMessageID: 000001
 *              ChatSessionID: 000001
 *              Message: Hey wow you're an octobass
 *              TimeStamp: Jan 1, 2019, 00:01
 *              UserID (author): 0000003
 *              
 *              ChatMessageID: 000002
 *              ChatSessionID: 000001
 *              Message: Yeah I'm 4x the bass you are, git gud noob
 *              TimeStamp: Jan 1, 2019, 00:02
 *              UserID (author): 0000004
 *      
 *      SocialPosts:
 *              PostID: 000001
 *              UserID (author): 0000003
 *              TimeStamp: Jan 1, 2019, 00:03
 *              Message: I met an octobass today and they bullied me.
 *              Image: https://i.imgur.com/JlXtPpf.png
 *      
 *      Likes:
 *              UserID 0000004 likes PostID 000001
 *      
 *      Comments:
 *              CommentID: 0000001
 *              PostID: 0000001
 *              Message: Then get 6 more bass you 2-bass scrub
 *              TimeStamp: Jan 1, 2019, 00:04
 *              UserID: 0000004
 *      
 *      Reports:
 *              ReportID: 0000001
 *              PostID: 0000001
 *              TimeStamp: Jan 1, 2019, 00:04
 *              UserID: 0000004
*/

const testuser1 = {
    UserID: 3,
    LoginName: 'testuser1',
    username: 'testuser1',
    Password: 'password',
    Created: new Date('January 1, 2019'),
    Horoscope: 'Leo',
    Log: 1,
    Birthday: new Date('July 27, 2015'),
    Base: 1
};

const testuser2 = {
    UserID: 4,
    LoginName: 'testuser2',
    username: 'testuser2',
    Password: 'password',
    Created: new Date('December 31, 2018'),
    Horoscope: 'Libra',
    Log: 10,
    Birthday: new Date('Sept 23, 1987'),
    Base: 2
};

const socialpost1 = {
    PostID: 1,
    UserID: 3,
    TimeStamp: new Date('January 1, 2019, 00:03'),
    Message: 'I met an octobass today and they bullied me.',
    Image: 'https://i.imgur.com/JlXtPpf.png'
};

const socialposts_user3 = new Array();
socialposts.push(socialpost1);

const socialposts_user4 = new Array();

const users = new Array();
users.push(testuser1);
users.push(testuser2);

const chatsessions = new Array();
const participants = new Array();
participants.push(3);
participants.push(4);
const chatsession1 = {
    ChatSessionID: 1,
    Title: 'the amazing chat session',
    CreationTimeStamp: new Date('January 1, 2019, 00:00'),
    Participants: participants
};
chatsessions.push(chatsession1);

const chatsession1_messages = new Array();
const chatmessage1 = {
    ChatMessageID: 1,
    ChatSessionID: 1,
    Message: "Hey wow you're an octobass",
    TimeStamp: new Date('January 1, 2019, 00:01'),
    UserID: 3
};
const chatmessage2 = {
    ChatMessageID: 2,
    ChatSessionID: 1,
    Message: "Yeah I'm 4x the bass you are, git gud noob",
    TimeStamp: new Date('January 1, 2019, 00:02'),
    UserID: 4
};
chatsession1_messages.push(chatmessage1);
chatsession1_messages.push(chatmessage2);


// Tests:
// Login tests

function login_tests(req, res) {
    const LoginName = req.body.LoginName;
    const Password = req.body.Password;
    console.log(`Login test initiated: LoginName: ${req.body.LoginName} || Password: ${req.body.Password}.`);
    // Proper request:
    if (LoginName === '') {
        console.log(`Login test failed: no LoginName in request body.`);
        res.sendStatus(400); // bad request
    }
    if (Password === '') {
        console.log(`Login test failed: no Password in request body.`);
        res.sendStatus(400); // bad request
    }
    // Wrong password
    if (LoginName === 'wrongpasswordtest') {
        console.log(`Wrong password test: sending status 401 (unauthorized). User should see wrong password notification`);
        res.sendStatus(401); // unauthorized
    }
    // Admin login
    if (LoginName === 'admin' && Password === 'password') {
        console.log(`Admin test initiated. Sending status 200 (success) and JWT to frontend. User should see admin interface`);
        res.status(200).json({
            LoginName: 'admin',
            jwt: admin_jwt
        });
    }
    // User login
    if (LoginName === 'testuser1' && Password === 'password') {
        console.log(`User test initiated. Sending status 200 (success) and JWT to frontend. User should see regular interface`);
        res.status(200).json({
            LoginName: 'testuser1',
            jwt: testuser1_jwt
        });
    }
}

// helper
function get_token(req) {
    return req.headers.authorization.split(' ')[1];
}

function admin_jwt_verified(req) {
    token = get_token(req);
    if (token === '') {
        console.log(`Missing JWT. Sending status 401 (unauthorized). User should see login screen.`);
        res.sendStatus(401); // missing token
        return false;
    } else if (token !== 'admin') {
        console.log(`Wrong JWT sent. Sending status 401 (unauthorized) to frontend. User should see login screen.`);
        res.sendStatus(401); // missing token
        return false;
    }
    else {
        console.log(`JWT passed verification.`);
        return true;
    }
}

function admin_overview_test(req, res) {
    console.log(`Admin overview test initiated.`);
    if (admin_jwt_verified(req)) {
        console.log(`Sending Status 200 (success). User (admin) should see links to list of users, chat sessions, and reports`);
        res.sendStatus(200);
    }
}

// STAGE 1
function admin_user_get_test(req, res) {
    console.log(`Admin users GET request received.`);

    if (admin_jwt_verified(req)) {
        const UserID = req.query.UserID;
        if (UserID === null) {
            console.log(`No userID specified, so sending list of users and some relevant information instead. User (admin) should see list of users.`);
            res.status(200).json(users);
        }
        else {
            if (UserID === "3") {
                console.log(`UserID = 3 specified. Sending user information along with list of social posts.`);
                res.status(200).json({ testuser1, socialposts_user3 });
            } else if (UserID === "4") {
                console.log(`UserID = 4 specified. Sending user information along with list of social posts.`);
            } else {
                res.status(200).json({ testuser2, socialposts_user4 });
            }
        }
    }
}

function admin_chat_session_get_test(req, res) {
    if (admin_jwt_verified(req)) {
        const ChatSessionID = req.query.ChatSessionID;
        if (ChatSessionID === null) {
            console.log(`No ChatSessionID specified, so sending list of chat sessions with info (no chat messages). User (admin) should see list of chat sessions.`);
            res.status(200).json(chatsessions);
        }
        else {
            if (ChatSessionID === "1") {
                console.log(`ChatSessionID = 1 specified. Chat Session = 1 along with all chat messages`);
                res.status(200).json({ chatsession1, chatsession1_messages });
            } else {
                // Some other chat ID was requested. TODO
                console.log(`ChatSessoinID = ${ChatSessionID} specified. Test not implemented. No response sent.`);
            }
        }
    }
}

function admin_user_post_test(req, res) {
    // todo
}

// Routes:
app.post('/login', login_tests);
app.get('/admin', admin_overview_test);
app.get('/admin/user', admin_user_get_test);
app.get('/admin/chat-session', admin_chat_session_get_test); // todo
app.get('/admin/reports', admin_reports_list_test); // todo
// TODO: regular user tests

app.listen(port, () => console.log(`Fake backend server running @port ${port}. Awaiting HTTP requests from frontend.`));