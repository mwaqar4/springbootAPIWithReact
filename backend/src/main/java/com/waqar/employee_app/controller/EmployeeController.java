package com.waqar.employee_app.controller;

import com.waqar.employee_app.entity.Employee;
import com.waqar.employee_app.entity.Company;
import com.waqar.employee_app.repository.EmployeeRepository;
import com.waqar.employee_app.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {
    private final EmployeeRepository employeeRepository;
    private final CompanyRepository companyRepository;

    @Autowired
    public EmployeeController(EmployeeRepository employeeRepository, CompanyRepository companyRepository) {
        this.employeeRepository = employeeRepository;
        this.companyRepository = companyRepository;
    }

    @PostMapping
    public ResponseEntity<Employee> create(@RequestBody @Valid Employee employee) {
//        {
//            "name": "employee4",
//                "surname": "surname 4",
//                "email":"m.w@gmail.com",
//                "address": "streert 4",
//                "salary": 5000.0,
//                "company" : {
//                    "name": "Hello Company1"
//                }
//        }
//        Optional<Company> optionalCompany = companyRepository.findById(employee.getCompany().getId());
        Optional<Company> optionalCompany = companyRepository.findByName(employee.getCompany().getName());

        if (!optionalCompany.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }

        employee.setCompany(optionalCompany.get());

        Employee savedEmployee = employeeRepository.save(employee);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
            .buildAndExpand(savedEmployee.getId()).toUri();

        return ResponseEntity.created(location).body(savedEmployee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> update(@PathVariable Integer id, @RequestBody Employee employee) {
        Optional<Employee> optionalEmployee = employeeRepository.findById(id);
        if (!optionalEmployee.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }

        Optional<Company> optionalCompany = companyRepository.findById(optionalEmployee.get().getCompany().getId());
//        Optional<Company> optionalCompany = companyRepository.findByName(employee.getCompany().getName());

        if (!optionalCompany.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }
        employee.setCompany(optionalCompany.get());

        employee.setId(optionalEmployee.get().getId());
        employeeRepository.save(employee);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Employee> delete(@PathVariable Integer id) {
        Optional<Employee> optionalEmployee = employeeRepository.findById(id);
        if (!optionalEmployee.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }

        employeeRepository.delete(optionalEmployee.get());

        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Employee>> getAll() {
        return ResponseEntity.ok(employeeRepository.getAllEmployyes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getById(@PathVariable Integer id) {
        Optional<Employee> optionalEmployee = employeeRepository.findById(id);
        if (!optionalEmployee.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }

        return ResponseEntity.ok(optionalEmployee.get());
    }
}
