package com.example.todobackend.practice;

public class PriorityValidator extends BaseValidator<String> implements Validator<String> {
    //課題1
    @Override
    public void doValidate(String value) {
        if ((!value.equals("HIGH")) && (!value.equals("MEDIUM")) && (!value.equals("LOW"))) {
            throw new InvalidPriorityException(value);
        }
    }

    public static void main(String[] args) {
//        Validator<String> validator = new PriorityValidator();
//        validator.validate("HIGH");
//        validator.validate("INVALID");
        Validator<String> v = new PriorityValidator();
        System.out.println(v.isValid("HIGH"));
        System.out.println(v.isValid("INVALID"));
    }
}
