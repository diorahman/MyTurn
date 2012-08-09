
Ext.define('testing.controller.Socket', {
    extend: 'Ext.app.Controller',
    socket: null,
    config: {
        control: {
            loginButton: { tap: 'doLogin' },
            logoutButton: { tap: 'doLogout' }
        },
        refs: {
            loginButton: "button[action=loginEvent]",
            logoutButton: "button[action=logoutEvent]",
            loginForm: "loginView"
        }
    },

    doLogout: function() {
        // in doLogin() we listen to resulting disconnect event
        this.socket.disconnect();
    },

    doLogin: function() {
        var values = this.getLoginForm().getValues();
        var loginName = values.userName;
        var roomName = values.groupName;
        this.socket = io.connect(null, { resource: 'api/socket.io', 'force new connection': true });
        this.socket.emit('login', { name: loginName, 'room': roomName });
        var application = this.getApplication();
        this.socket.on('userRejected', function(data) {
            var msg = data.reason == 'alreadyExists' ? 'Try a different name' : data.reason == 'groupNotDefined' ? 'Group was not defined' : '';
            Ext.Msg.alert('', msg);
            application.fireEvent('userLoggedOut');
        });
        this.socket.on('disconnect', function() {
            application.fireEvent('userLoggedOut');
        });
        this.socket.on('userAccepted', function() {
            application.fireEvent('userLoggedIn');
        });
        this.socket.on('message', function(data) {
            // TODO this implies a dependency between server message types and client ones
            application.fireEvent(data.messageType, data);
        });
    },

    init: function() {
        this.getApplication().on({
            clientMessage: function(data) {
                if(this.socket) {
                    this.socket.emit('clientMessage', data);
                }
            },
            scope: this
        });
        this.getApplication().on({
            discussionOver: this.doLogout,
            scope: this
        });
    }

});