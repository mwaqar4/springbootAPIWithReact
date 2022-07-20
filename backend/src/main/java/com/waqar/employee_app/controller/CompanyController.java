package com.waqar.employee_app.controller;

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
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/companies")
public class CompanyController {
    private final CompanyRepository companyRepository;
    private final EmployeeRepository employeeRepository;

    @Autowired
    public CompanyController(CompanyRepository companyRepository, EmployeeRepository employeeRepository) {
        this.companyRepository = companyRepository;
        this.employeeRepository = employeeRepository;
    }

    @PostMapping
    public ResponseEntity<Company> create(@Valid @RequestBody Company company) {
//        {
//            "name": "Hello Company2",
//                "employees": [
//                    {
//                        "name": "Company 1- employee 1",
//                            "surname": "surname 1",
//                            "email":"m.w@gmail.com",
//                            "address": "streert 1",
//                            "salary": 2000.0
//                    },
//                    {
//                        "name": "Company 1- employee 2",
//                            "surname": "surname 2",
//                            "email":"m.w@gmail.com",
//                            "address": "streert 2",
//                            "salary": 3000.0
//                    }
//            ]
//        }
        Company savedCompany = companyRepository.save(company);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
            .buildAndExpand(savedCompany.getId()).toUri();

        return ResponseEntity.created(location).body(savedCompany);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Company> update(@PathVariable Integer id, @Valid @RequestBody Company company) {
        Optional<Company> optionalCompany = companyRepository.findById(id);
        if (!optionalCompany.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }

        company.setId(optionalCompany.get().getId());
        companyRepository.save(company);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Company> delete(@PathVariable Integer id) {
        Optional<Company> optionalCompany = companyRepository.findById(id);
        if (!optionalCompany.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }

        companyRepository.delete(optionalCompany.get());

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getById(@PathVariable Integer id) {
        Optional<Company> optionalCompany = companyRepository.findById(id);
        if (!optionalCompany.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }

        return ResponseEntity.ok(optionalCompany.get());
    }

    @GetMapping
    public ResponseEntity<Page<Company>> getAll(Pageable pageable) {
        return ResponseEntity.ok(companyRepository.findAll(pageable));
    }

    @GetMapping("/{id}/avg_salary")
    public ResponseEntity<Double> getAverageSalary(@PathVariable Integer id) {
        Double salary = companyRepository.getAverageSalary(id);
        return ResponseEntity.ok(salary);
    }

}
