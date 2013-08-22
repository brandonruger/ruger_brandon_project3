/* Brandon Ruger
 * Project 3
 * VFW 1308 */

window.addEventListener("DOMContentLoaded", function(){
    
    //Function to get elements from HTML file.
    function getElements(x) {
        var theElement = document.getElementById(x);
        return theElement;
    }
    
    
    
    //Dynanmically create select field and populate it with options.
    function makeFleaMedOptions() {
        var formTag = document.getElementsByTagName("form");
        var chooseList = getElements('select');
        var makeSelect = document.createElement('select');
        makeSelect.setAttribute("id", "fleaRx");
        for (var i=0, j=fleaMedication.length; i<j; i++) {
            var createOption = document.createElement('option');
            var optionText = fleaMedication[i];
            createOption.setAttribute("value", optionText);
            createOption.innerHTML = optionText;
            makeSelect.appendChild(createOption);
        }
        chooseList.appendChild(makeSelect);
    }
    
    //Function to determine which check boxes are checked:
    function getSelectedCheckedBoxes() {
        if (getElements('flea').checked) {
            fleaValue = getElements('flea').value;
        } else {
            fleaValue = "No"
        };
        if (getElements('heartworm').checked){
            heartwormValue = getElements('heartworm').value;
        } else {
            heartwormValue = "No"
        };
        if (getElements('other').checked) {
            otherValue = getElements('other').value;
        } else{
            otherValue = "No"
        };
    };

    function toHideForm(n) {
        switch (n){
            case "on":
                getElements('addReminderForm').style.display = "none";
                getElements('clearData').style.display = "inline";
                getElements('displayData').style.display = "none";
                getElements('addNewReminder').style.display = "inline";
                break;
            case "off":
                getElements('addReminderForm').style.display = "block";
                getElements('clearData').style.display = "inline";
                getElements('displayData').style.display = "inline";
                getElements('addNewReminder').style.display = "none";
                getElements('items').style.display = "none";
                break;
            default:
                return false;
        }
    }
    
    //Create function to submit data.
    function submitData(key) {
        //If there is no key, this means this is a brand new item and we need a new key.
        if (!key) {
            var generateId = Math.floor(Math.random()*100000001);
        }else{
            //Set the id to the existing key we're editing, so it will save over the data.
            id = key;
        }
        
        //Gather up all our form field values and store in an object.
        //Object properties contain array with the form label and input value.
        getSelectedCheckedBoxes(); 
        var itemList            = {};
            itemList.fleaRx     = ["Flea Rx:", getElements('select').value];
            itemList.petname    = ["Pet Name:", getElements('petname').value];
            itemList.petage     = ["Pet Age:", getElements('petage').value];
            itemList.pettype    = ["Pet Type:", getElements('pettype').value];
            itemList.flea       = ["Flea:", fleaValue];
            itemList.heartworm  = ["Heartworm:", heartwormValue];
            itemList.other      = ["Other:", otherValue];
            itemList.date       = ["Date:", getElements('date').value];
            itemList.range      = ["Range:", getElements('range').value];
            itemList.note       = ["Note:", getElements('note').value];
            
            //Save data into Local Storage
            localStorage.setItem(generateId, JSON.stringify(itemList));
            alert("Reminder has been added!");
    }
    
    function getDataFromStorage() {
        toHideForm("on");
        //Write Data from local storage to the browser
        var createDiv = document.createElement('div');
        createDiv.setAttribute("id", "items");
        var createList = document.createElement('ul');
        createDiv.appendChild(createList);
        document.body.appendChild(createDiv);
        getElements('items').style.display = "block";
        for (var i=0; i<localStorage.length; i++) {
            var createListItem = document.createElement('li');
            var newLinksLi = document.createElement('li');
            createList.appendChild(createListItem);
            var key = localStorage.key(i);
            var dataValue = localStorage.getItem(key);
            //Convert string from local storage back to an Object.
            var findObject = JSON.parse(dataValue);
            var subList = document.createElement('ul');
            createListItem.appendChild(subList);
            for (var n in findObject) {
                var makeSublist = document.createElement('li');
                subList.appendChild(makeSublist);
                var subText = findObject[n][0]+ " " +findObject[n][1];
                makeSublist.innerHTML = subText;
                createListItem.appendChild(newLinksLi);
            }
            createEditDelLinks(localStorage.key(i), newLinksLi); //Create our edit and delete links for each item in local storage.
            
        }
        
    }
    
    //Function to create edit/delete links for each stored item when displayed.
    function createEditDelLinks(key, newLinksLi) {
        //add edit single item link
        var editLink = document.createElement('a');
        editLink.href = "#";
        editLink.key = key;
        var editText = "Edit Reminder";
        editLink.addEventListener("click", editItem);
        editLink.innerHTML = editText;
        newLinksLi.appendChild(editLink);
        
        //add line break
        var breakTag = document.createElement('br');
        newLinksLi.appendChild(breakTag);
        
        //add delete single item link
        var deleteLink = document.createElement('a');
        deleteLink.href = "#";
        deleteLink.key = key;
        var deleteText = "Delete Reminder";
        deleteLink.addEventListener("click", deleteItem);
        deleteLink.innerHTML = deleteText;
        newLinksLi.appendChild(deleteLink);
    }
    
    function editItem() {
        //Grab the data from our item from Local Storage.
        var value = localStorage.getItem(this.key);
        var obj = JSON.parse(value);
        
        //Show the form
        toHideForm("off");
        
        //Populate form fields with current localStorage values.
        getElements('select').value = obj.fleaRx[1];
        getElements('petname').value = obj.petname[1];
        getElements('petage').value = obj.petage[1];
        getElements('pettype').value = obj.pettype[1];

        if(obj.flea[1] == "Yes") {
            getElements('fleaValue').setAttribute("checked", "checked");
        }
        
        if (obj.heartworm[1] == "Yes") {
            getElements('heartwormValue').setAttribute("checked", "checked");
            
        }
        
        if (obj.other[1] == "Yes") {
            getElements('otherValue').setAttribute("checked", "checked");
        }
                
        getElements('date').value = obj.date[1];
        getElements('range').value = obj.range[1];
        getElements('note').value = obj.note[1];
        
        //Remove the initial listener from the imput 'create reminder' button.
        createButton.removeEventListener("click", submitData);
        //Change Submit button value to Edit button
        getElements('button').value = "Edit Reminder";
        var editSubmit = getElements('button');
        
        //Save the key value established in this function as a property of the editSubmit event.
        //So that we can use that value when we save the data we edited.
        editSubmit.addEventListener("click", validate);
        editSubmit.key = this.key;
        
    }
    
    function deleteItem() {
        var askUser = confirm("Are you sure you want to delete this reminder?");
        if (askUser) {
            localStorage.removeItem(this.key);
            alert("Reminder was deleted!");
            window.location.reload();
        }else{
            alert("Reminder was NOT delelted.")
        }
    }
    
    function clearLocalStorage() {
        if (localStorage.length === 0) {
            alert("There is no data to clear.")
        } else {
            localStorage.clear();
            alert("All Reminders have been deleted!");
            window.location.reload();
            return false;
        }
    }
    
    function validate(eventData) {
        //Define the elements we want to check
        var getPetName = getElements('petname');
        var getPetAge = getElements('petage');
        var getPetType = getElements('pettype');
        
        //Reset Error Messages
        //errorMsg.innerHTML = "";
        getPetName.style.border = "1px solid black";
        getPetAge.style.border = "1px solid black";
        getPetType.style.border = "1px solid black";
        
        
        //Get Error Messages
        var errorMessagesArray = [];
        
        //Pet Name Validation
        if (getPetName.value === "") {
            var nameError = "Please enter your pet's name.";
            getPetName.style.border = "1px solid red";
            errorMessagesArray.push(nameError);
        }
        
        //Pet Age Validation
        if (getPetAge.value === "") {
            var ageError = "Please enter your pet's age.";
            getPetAge.style.border = "1px solid red";
            errorMessagesArray.push(ageError);
        }
        
        /*Regular Expression
        var re = regular express for number check
        if (!(re.exect(getPetAge.value))){
            var ageError = "Please enter your pet's age.";
            ageError.style.border = "1px solid red";
            errorMessages.push(ageError);
        }
        
        */
        
        //Pet Type Validation
        if (getPetType.value === ""){
            var typeError = "Please enter your pet's type.";
            getPetType.style.border = "1px solid red";
            errorMessagesArray.push(typeError);
        }
        
        //If there were errors, display them on screen.
        if (errorMessagesArray.length >= 1) {
            for (var i=0, j=errorMessagesArray.length; i<j; i++) {
                var txt = document.createElement('li');
                txt.innerHTML = errorMessagesArray[i];
                errorMsg.appendChild(txt);
;            }
            ventData.preventDefault();
            return false;
        } else{
            //If all is OK, save our data!
            //Send key value which came from edit function.
            //Remember this key value was passed through the event Listener as a property.
            submitData(this.key);
        }

    }
    
    //Variable Defaults
    var fleaMedication = ["--Type of Flea Medication--", "Topical", "Oral", "Spray-On"];
    var fleaCheckBox;
    var fleaValue;
    var heartwormValue;
    var otherValue;
    var errorMsg = getElements('errorMessages');
    makeFleaMedOptions();
    
    //Set Link & Submit Click Events
    
    var displayData = getElements('displayData');
    displayData.addEventListener("click", getDataFromStorage);
    var clearData = getElements('clearData');
    clearData.addEventListener("click", clearLocalStorage);
    var createButton = getElements('button');
    createButton.addEventListener("click", validate);
    
    
    
    
    
});

