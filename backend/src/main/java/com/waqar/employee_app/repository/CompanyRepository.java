package com.waqar.employee_app.repository;

import com.waqar.employee_app.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Integer>{
    @Query("select c from Company c where c.name = :name")
    public Optional<Company> findByName(@Param("name") String name);

    @Query("select avg(e.salary) from Employee e where e.company.id = :id")
    public Double getAverageSalary(@Param("id") int id);
}
