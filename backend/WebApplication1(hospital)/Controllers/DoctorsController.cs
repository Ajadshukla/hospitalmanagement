using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1_hospital_.Models;

namespace WebApplication1_hospital_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : ControllerBase
    {
        private readonly HospitalContext _context;

        public DoctorsController(HospitalContext context)
        {
            _context = context;
        }

        // GET: api/doctors
        [HttpGet]
        public IActionResult GetAll()
        {
            var doctors = _context.Doctors
                .Select(d => new
                {
                    d.Id,
                    d.Name,
                    d.Specialization,
                    d.Phone
                })
                .ToList();

            return Ok(doctors);
        }

        // GET: api/doctors/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var doctor = _context.Doctors.Find(id);
            if (doctor == null) return NotFound();

            return Ok(new
            {
                doctor.Id,
                doctor.Name,
                doctor.Specialization,
                doctor.Phone
            });
        }

        // POST: api/doctors
        [HttpPost]
        public IActionResult Create([FromBody] Doctor doctor)
        {
            _context.Doctors.Add(doctor);
            _context.SaveChanges();
            return Ok(new
            {
                doctor.Id,
                doctor.Name,
                doctor.Specialization,
                doctor.Phone
            });
        }

        // PUT: api/doctors/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Doctor updated)
        {
            var doctor = _context.Doctors.Find(id);
            if (doctor == null) return NotFound();

            doctor.Name = updated.Name;
            doctor.Specialization = updated.Specialization;
            doctor.Phone = updated.Phone;

            _context.SaveChanges();
            return Ok(new
            {
                doctor.Id,
                doctor.Name,
                doctor.Specialization,
                doctor.Phone
            });
        }

        // DELETE: api/doctors/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var doctor = _context.Doctors.Find(id);
            if (doctor == null) return NotFound();

            _context.Doctors.Remove(doctor);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
