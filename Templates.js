const colorPicker = `
    <div class="picker-wrapper">
        <div class="twitter-picker twitter-picker">
            <div class="triangle"></div>
                <div style="padding: 15px 9px 9px 15px;">
                    <span>
                    <div title="green" tabindex="0" style="background: var(--green); height: 30px; width: 30px; cursor: pointer; position: relative; outline: none; float: left; border-radius: 4px; margin: 0px 6px 6px 0px;"></div>
                    </span><span>
                    <div title="blue" tabindex="0" style="background: var(--blue); height: 30px; width: 30px; cursor: pointer; position: relative; outline: none; float: left; border-radius: 4px; margin: 0px 6px 6px 0px;"></div>
                    </span><span>
                    <div title="orange" tabindex="0" style="background: var(--orange); height: 30px; width: 30px; cursor: pointer; position: relative; outline: none; float: left; border-radius: 4px; margin: 0px 6px 6px 0px;"></div>
                    </span><span>
                    <div title="red" tabindex="0" style="background: var(--red); height: 30px; width: 30px; cursor: pointer; position: relative; outline: none; float: left; border-radius: 4px; margin: 0px 6px 6px 0px;"></div>
                    </span><span>
                    <div title="purple" tabindex="0" style="background: var(--purple); height: 30px; width: 30px; cursor: pointer; position: relative; outline: none; float: left; border-radius: 4px; margin: 0px 6px 6px 0px;"></div>
                    </span><span>
                    <div title="teal" tabindex="0" style="background: var(--teal); height: 30px; width: 30px; cursor: pointer; position: relative; outline: none; float: left; border-radius: 4px; margin: 0px 6px 6px 0px;"></div>
                    </span>
                    <div style="position: relative;"></div>
                <div style="clear: both;"></div>
            </div>
        </div>
    </div>`;

const habitPopUp = `
        <div class="modal-dialog">
            <div class="modal-content" role="document">
                <div class="modal-header"><button type="button" class="close"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><a class="modal-title">Create Habit</a></div>
                    <div class="newHabit">
                    <div class="field"><a class="label">Habit</a><input type="text" class="habitname" name="habitname" placeholder="e.g. walk the dog" maxlength="40"></div>
                    <div class="field"><button class="modal-button" tabindex="0">Create Habit</button><a class="modal-button cancel">Cancel</a></div>
                    <div class="clear">
                    </div>
                </div>
            </div>
        </div>`
        ;

const editPopUp = function(name) {
    return `
    <div class="modal-dialog">
        <div class="modal-content" role="document">
            <div class="modal-header"><button type="button" class="close"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><a class="modal-title">Edit Habit</a></div>
                <div class="newHabit">
                <div class="field"><a class="label">Habit</a><input type="text" class="habitname" name="habitname" placeholder="e.g. walk the dog" value=${name} maxlength="40"></div>
                <div class="field"><a class="delete-button"><i class="ion-close-round"></i><span>delete</span></a><button class="modal-button tabindex="0">Edit Habit</button><a class="modal-button cancel">Cancel</a></div>
                <div class="clear">
                </div>
            </div>
        </div>
    </div>`
}

const categorieContainer = function(categorie) {
    return `
    <div class="menuItem" id="controls"><i class="ion-edit"></i></div>
    <div class="color-picker-wrapper" id="controls">
    <div class="color-picker" style="background-color: var(--${categorie.color});"></div>
    </div><a class="draggable">
    <div><span>Categorie</span>
    <div class="above"></div>
    </div>
    </a>`
}
    
export {colorPicker, habitPopUp, editPopUp, categorieContainer}