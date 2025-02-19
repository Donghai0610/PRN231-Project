using BusinesObjects.Models;
using BusinesObjects;
using Microsoft.EntityFrameworkCore;

namespace MovieWebAPI.Repository
{
    public class ActorRepository
    {
        private readonly ApplicationDBContext _context;

        // Constructor để inject ApplicationDbContext
        public ActorRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        // Thêm một Actor mới vào cơ sở dữ liệu
        public async Task<Actor> AddActorAsync(Actor actor)
        {
            _context.Actors.Add(actor);
            await _context.SaveChangesAsync();
            return actor; // Trả về Actor đã thêm vào
        }

        // Lấy tất cả Actor từ cơ sở dữ liệu
        public async Task<IEnumerable<Actor>> GetAllActorsAsync()
        {
            return await _context.Actors.ToListAsync();
        }

        // Lấy Actor theo ID
        public async Task<Actor> GetActorByIdAsync(int actorId)
        {
            return await _context.Actors.FirstOrDefaultAsync(a => a.ActorId == actorId);
        }

        // Cập nhật Actor trong cơ sở dữ liệu
        public async Task<bool> UpdateActorAsync(Actor actor)
        {
            _context.Actors.Update(actor);
            var result = await _context.SaveChangesAsync();
            return result > 0; // Trả về true nếu cập nhật thành công
        }

        // Xóa Actor khỏi cơ sở dữ liệu
        public async Task<bool> DeleteActorAsync(int actorId)
        {
            var actor = await GetActorByIdAsync(actorId);
            if (actor == null) return false;

            _context.Actors.Remove(actor);
            var result = await _context.SaveChangesAsync();
            return result > 0; // Trả về true nếu xóa thành công
        }

        // Kiểm tra xem Actor có tồn tại trong cơ sở dữ liệu hay không (theo tên)
        public async Task<bool> IsActorExistsAsync(string name)
        {
            return await _context.Actors.AnyAsync(a => a.FullName == name);

        }
    }
}
