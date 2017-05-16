// Panel that holds settings for the user to edit
class UserSettingPanel extends React.Component {
  constructor() {
    super();
    this.state = {};
    // Pre-make data object
    this.state.data = {};
  }

  // When this is rendered, load the account
  componentDidMount() {
    this.loadAccount();
  }

  // Load account data  
  loadAccount() {
    const self = this;
    sendAjax('GET', '/getCurrentAccount', { _csrf: this.props.csrf })
      .then((data) => {
        self.setState({
          data: {
            account: data.account
          },
        });
      });
  }

  // Update the user name
  updateUsername(e) {
    e.preventDefault();

    // Check if a new username is entered.
    if ($('#user').val() == '') {
      handleError('Enter new username');
      return false;
    }

    // Send update request
    sendAjax('PUT', $('#usernameForm').attr('action'), $('#usernameForm').serialize(), redirect);

    return false;
  };

  // Update the user's password
  updatePassword(e) {
    e.preventDefault();

    // Check the password fields
    if ($('#password').val() === '' || $('#password2').val() === '') {
      handleError('All fields are required.');
      return false;
    }

    // Check if the passwords are equal
    if ($('#password').val() !== $('#password2').val()) {
      handleError('Make sure the password fields match.');
      return false;
    }

    // Send updated password request
    sendAjax('PUT', $('#passwordForm').attr('action'), $('#passwordForm').serialize(), redirect);

    return false;
  };

  render() {
    const account = this.state.data.account;

    // Check if the account data is loaded
    if (!account) {
      return (
        <div className="panel">Loading Account Info</div>
      )
    }

    /// Render account options 
    return (
      <div id="userSettingsPanel" className="panel">
        <h2>Username: {account.username}</h2>
        <hr />
        <form
          id="usernameForm"
          onSubmit={this.updateUsername}
          action="/updateUsername"
          method="PUT"
        >
          <label htmlFor="name">Change Username</label><br />
          <input id="user" type="text" name="user" placeholder="New User Name" />
          <br />
          <input type="hidden" name="_csrf" value={this.props.csrf} />
          <input type="submit" value="Change Username" />
        </form>

        <form
          id="passwordForm"
          onSubmit={this.updatePassword}
          action="/updatePassword"
          method="PUT"
        >
          <label htmlFor="name">Change Password</label><br />
          <input id="password" type="text" name="password" placeholder="New Password" /><br />
          <input id="password2" type="text" name="password2" placeholder="Repeat New Password" /><br />
          <input type="hidden" name="_csrf" value={this.props.csrf} />
          <input type="submit" value="Change Password" />
        </form>
        <div id="errorMessage"></div>
      </div>
    );
  }
}