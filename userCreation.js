import { LightningElement, track, wire } from "lwc";
import getProfileOptions from "@salesforce/apex/UserController.getProfileOptions";
import getRoleOptions from "@salesforce/apex/UserController.getRoleOptions";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import createUser from "@salesforce/apex/UserController.createUser";

export default class UserCreation extends LightningElement {
  @track firstName;
  @track lastName;
  @track alias;
  @track username;
  @track email;
  @track profileId;
  @track roleId;
  @track profileOptions;
  @track profileIdValue;
  @track roleOptions;
  @track roleIdValue;

  @wire(getProfileOptions)
  wiredProfileOptions({ error, data }) {
    if (data) {
      this.profileOptions = data.map((profile) => ({
        label: profile.profileName,
        value: profile.profileId
      }));
    } else if (error) {
      console.log(error);
    }
  }

  @wire(getRoleOptions)
  wiredRoleOptions({ error, data }) {
    if (data) {
      this.roleOptions = data.map((role) => ({
        label: role.roleName,
        value: role.roleId
      }));
    } else if (error) {
      console.log(error);
    }
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this[name] = value;
    this.name = event.target.value;
  }

  handleProfileChange(event) {
    this.profileId = event.detail.value;
  }

  handleRoleChange(event) {
    this.roleId = event.detail.value;
  }

  handleSubmit() {
    createUser({
      firstName: this.firstName,
      lastName: this.lastName,
      alias: this.alias,
      username: this.username,
      email: this.email,
      roleId: this.roleId
    })
      .then((result) => {
        this.showToast("success", "User Created", "User created successfully.");
        console.log("User creation :", result);
      })
      .catch((error) => {
        const statusCode = error.body.fieldErrors?.Username[0].statusCode ;
        this.showToast("error", "Error Message", statusCode);
        console.log("User not creation: ", error);
        console.log("Status code", statusCode);
      });
    this.firstName = "";
    this.lastName = "";
    this.alias = "";
    this.username = "";
    this.email = "";
    this.roleId = "";
  }

  showToast(variant, title, message) {
    const event = new ShowToastEvent({
      title: title,
      variant: variant,
      message: message
    });
    this.dispatchEvent(event);
  }
}
