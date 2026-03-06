using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1_hospital_.Models;

namespace WebApplication1_hospital_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly HospitalContext _context;

        public PatientsController(HospitalContext context)
        {
            _context = context;
        }

        // GET: api/patients
        [HttpGet]
        public IActionResult GetAll()
        {
            var patients = _context.Patients
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Age,
                    p.Gender,
                    p.Phone
                })
                .ToList();

            return Ok(patients);
        }

        // GET: api/patients/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var patient = _context.Patients.Find(id);
            if (patient == null) return NotFound();

            return Ok(new
            {
                patient.Id,
                patient.Name,
                patient.Age,
                patient.Gender,
                patient.Phone
            });
        }

        // POST: api/patients
        [HttpPost]
        public IActionResult Create([FromBody] Patient patient)
        {
            _context.Patients.Add(patient);
            _context.SaveChanges();
            return Ok(new
            {
                patient.Id,
                patient.Name,
                patient.Age,
                patient.Gender,
                patient.Phone
            });
        }

        // PUT: api/patients/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Patient updated)
        {
            var patient = _context.Patients.Find(id);
            if (patient == null) return NotFound();

            patient.Name = updated.Name;
            patient.Age = updated.Age;
            patient.Gender = updated.Gender;
            patient.Phone = updated.Phone;

            _context.SaveChanges();
            return Ok(new
            {
                patient.Id,
                patient.Name,
                patient.Age,
                patient.Gender,
                patient.Phone
            });
        }

        // DELETE: api/patients/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var patient = _context.Patients.Find(id);
            if (patient == null) return NotFound();

            _context.Patients.Remove(patient);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
