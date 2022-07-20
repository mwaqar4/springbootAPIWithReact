package com.waqar.employee_app.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Optional;

@Entity
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotNull
    private String name;
    @NotNull
    private String surname;
    @NotNull
    private String email;
    private String address;
    @NotNull
    private Double salary;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Company company;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY  ,required = false)
    @Column(insertable = false, updatable = false)
    @Transient //to avoid saving it into database/sql
    private int jsonCompanyId;
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }
    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public Employee(int id, String name, String surname, String email, String address, Double salary, int jsonCompanyId) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.address = address;
        this.salary = salary;
        this.jsonCompanyId = jsonCompanyId;
    }

    public Employee() {
    }

    public int getJsonCompanyId() {
        return jsonCompanyId;
    }

    public void setJsonCompanyId(int jsonCompanyId) {
        this.jsonCompanyId = jsonCompanyId;
    }
}
