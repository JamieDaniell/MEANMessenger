import { Component , OnInit } from "@angular/core";
import { FormGroup , FormControl , Validators , NgForm } from "@angular/forms";
import { AuthService } from "./auth.service";
import { User } from './user.model';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html'
})

export class SignupComponent implements OnInit
{
    myForm: FormGroup;
    constructor( private authService: AuthService) {}

    onSubmit()
    {
        
        const user = new User(
                this.myForm.value.email,
                this.myForm.value.password,
                this.myForm.value.firstName,
                this.myForm.value.lastName );
                console.log("HELLO");
        this.authService.signup(user)
            .subscribe( 
                data => console.log(data),
                error => console.log(error),
                () => this.myForm.reset()    
            );
        // ;
    }

    ngOnInit()
    {
        this.myForm = new FormGroup({
            firstName: new FormControl(''),
            lastName: new FormControl(''),
            email: new FormControl(''),
            password: new FormControl('')
        });
    }

}
