import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from 'src/app/services/config.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  public form: FormGroup
  public name: AbstractControl
  public phone: AbstractControl
  public email: AbstractControl
  public document: AbstractControl
  public salary: AbstractControl
  public gender: AbstractControl
  public dateofbirth: AbstractControl
  public sub = false
  public employees: any[] = []
  public selectedId = ""

  constructor(
    public formBuilder: FormBuilder,
    public config: ConfigService,
    private employeeService: EmployeeService
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      phone:['', Validators.required],
      email:['', Validators.required],
      document:['', Validators.required],
      salary:['', Validators.required],
      gender:['', Validators.required],
      dateofbirth:['', Validators.required]
    })
    this.name = this.form.controls['name']
    this.phone = this.form.controls['phone']
    this.email = this.form.controls['email']
    this.document = this.form.controls['document']
    this.salary = this.form.controls['salary']
    this.gender = this.form.controls['gender']
    this.dateofbirth = this.form.controls['dateofbirth']
  }

  ngOnInit(): void {
    this.list()
  }

  get f() {
    return this.form.controls
  }

  validacion() {
    console.log(this.form.value)
    this.sub = true
    if (this.form.invalid)
      return
    this.add()
  }

  create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  getConfigFc() {
    return this.config
  }

  add() {
    //console.log(this.selectedId)
    if (this.selectedId) {
      //console.log(1)
      this.commitEdit()
    } else {
      //console.log(this.form.controls['user'].value)
      //console.log(2)
      //this.users.push({ id: this.create_UUID() , user : this.form.controls['user'].value, status: false})
      //console.log(this.users)

      this.employeeService.create(this.form.value).subscribe({
        next: (res: any) => {
          if (res.status) {
            console.log('Employee registered successfully')
          }
        },
        complete: () => { this.list() }, // completeHandler
        error: () => { console.log('Error creating employee') }    // errorHandler
      })
    }
    this.reset()
    this.sub = false


  }

  reset() {
    this.form.reset()
  }

  edit(item: any) {
    console.log(item)
    this.form.get('name')?.setValue(item.name)
    this.form.get('phone')?.setValue(item.phone)
    this.form.get('email')?.setValue(item.email)
    this.form.get('document')?.setValue(item.document)
    this.form.get('salary')?.setValue(item.salary)
    this.form.get('gender')?.setValue(item.gender)
    this.form.get('dateofbirth')?.setValue(item.dateofbirth)
    this.selectedId = item._id
  }

  commitEdit() {
    for (let index = 0; index < this.employees.length; index++) {
      if (this.employees[index]._id == this.selectedId) {
       // this.users[index].user = this.form.get('user')?.value

        this.employeeService.update({
          _id: this.selectedId,
          name: this.form.get('name')?.value,
          phone: this.form.get('phone')?.value,
          email: this.form.get('email')?.value,
          document: this.form.get('document')?.value,
          salary: this.form.get('salary')?.value,
          gender: this.form.get('gender')?.value,
          dateofbirth: this.form.get('dateofbirth')?.value
        }).subscribe({
          next: (res: any) => {
            if (res.status) {
            }
          },
          complete: () => { this.list()
          }, // completeHandler
          error: () => { console.log('Error updating employee') }    // errorHandler
        })
        //console.log(this.form.get('user')?.value)
      }
    }
    this.selectedId = ""
    //console.log(this.users)
  }

  delete(_id: string) {
    for (let index = 0; index < this.employees.length; index++) {
      if (this.employees[index]._id == _id) {
        this.employeeService.delete(_id).subscribe({
          next: (res: any) => {
            if (res.status) {
              this.employees.splice(index, 1)
              console.log('Empleado eliminado')
            }
          },
          complete: () => { this.list() }, // completeHandler
          error: () => { console.log('Error removing employee') }    // errorHandler
        })
      }
    }
  }


  disEnable(item: any) {
    for (let index = 0; index < this.employees.length; index++) {
      if (this.employees[index]._id == item._id) {
        this.employeeService.active({
          _id: item._id,
          status: !item.status
        }).subscribe({
          next: (res: any) => {
            if (res.status) {
              console.log('Empleado actualizado')
            }
          },
          complete: () => {
            this.employees[index].status = !this.employees[index].status
          }, // completeHandler
          error: () => { console.log('Error removing employee') }    // errorHandler
        })
      }
    }
  }
  /*{ _id: _id },
    {
      status: status
    }*/

  list() {
    this.employeeService.list().subscribe({
      next: (res: any) => {
        if (res.length>0) {
          this.employees = res
        }
      },
      complete: () => { console.log('Empleados listados') }, // completeHandler
      error: () => { console.log('Error to list employees') }    // errorHandler
    })
  }
  searchget(event:any) {
      this.employeeService.search({
        user: event.target.value
      }).subscribe({
        next: (res: any) => {
          console.log(res)
          console.log(res.length)
          if (res.length>0) {
            this.employees = res
          }
        },
        complete: () => { console.log('Empleados listados') }, // completeHandler
        error: () => { console.log('Error to list employees') }    // errorHandler
      })
  }
}

