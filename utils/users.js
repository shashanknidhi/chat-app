const users = [];

//join user to chat

function joinUser(id,username,room){
    const user = {id,username,room};

    users.push(user);
    return user;

}

//Get Current User

function getCurrentUser(id){
    return users.find(user => user.id === id);

};

//user leaves

function userLeave(id){
    const index = users.findIndex(user => user.id === id);
    if(index != -1){
        return users.splice(index,1)[0];
    }
}

//get room users

function roomUser(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    joinUser,
    getCurrentUser,
    userLeave,
    roomUser
};