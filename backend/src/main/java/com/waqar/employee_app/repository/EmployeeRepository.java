package com.waqar.employee_app.repository;

import com.waqar.employee_app.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Integer>{
    @Query("select new Employee (e.id, e.name, e.surname,e.email,e.address,e.salary, e.company.id) from Employee e")
    List<Employee> getAllEmployyes();
}
