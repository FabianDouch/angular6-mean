import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material';

import { IssueService }     from '../../issue.service';
import { Issue }    from '../../issue.model';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  id: String;
  issue: any = {};
  updateForm: FormGroup;

  constructor(
    private issueService: IssueService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  createForm() {
    this.updateForm = this.fb.group({
      title: ['', Validators.required],
      responsible: '',
      description: '',
      severity: '',
      status: ''
    });
  }

  ngOnInit() {
    //this takes the params parse through the route/url
    //once the params are available when then call a function that sets the id
    this.route.params.subscribe(params => {
      this.id = params.id;
      //when then get the issue by using the id supplied through the url
      //once the response comes back we set it to this.issue
      this.issueService.getIssueById(this.id).subscribe(res => {
        this.issue = res;
        //we now set the values of the form
        console.log(this.issue.severity);
        this.updateForm.get('title').setValue(this.issue.title);
        this.updateForm.get('responsible').setValue(this.issue.responsible);
        this.updateForm.get('description').setValue(this.issue.description);
        this.updateForm.get('severity').setValue(this.issue.severity);
        this.updateForm.get('status').setValue(this.issue.status);
      })
    })
  }

  updateIssue(title, responsible, description, severity, status) {
    console.log(severity);
    this.issueService.updateIssue(this.id, title, responsible, description, severity, status)
        .subscribe(() => {
          //params 'Message displayed', 'action' {config}
          this.snackBar.open('Issue updated successfully', 'OK', {
            duration: 3000
        });
      });
  }










}
