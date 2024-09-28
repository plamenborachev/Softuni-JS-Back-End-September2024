import { Schema, model } from 'mongoose';

const studentSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
    },
    lastName: String, // Optional by default
    age: {
        type: Number,
        min: [18, 'Student should be at least 18 years old, got {VALUE}!'], //Mongoose replaces {VALUE} with the value being validated
        max: [120, 'Student cannot be more than 120 year old, got {VALUE}!!'],
    },
});

// Custom methods
studentSchema.method('greet', function (destination) {
    return `Hi ${destination} my name is ${this.fullName} and I'm ${this.age} years old!`;
});
//Second variant:
// studentSchema.methods.greet = function (destination) {
//     return `Hi ${destination} my name is ${this.name} and I'm ${this.age} years old!`;
// }

// Virtual Property
studentSchema
    .virtual('fullName')
    .get(function () {
        return `${this.name} ${this.lastName}`;
    })
    .set(function(fullName) {
        const [firstName, lastName] = fullName.split(' ');

        this.name = firstName;
        this.lastName = lastName;
    });

// Custom validation
studentSchema.path('name')
    .validate(function(name) {
        const isValid = name.length > 2 && name.length < 10;

        return isValid;
    }, 'Name should be less than 10 characters and more than 2!');

const Student = model('Student', studentSchema);

export default Student;
