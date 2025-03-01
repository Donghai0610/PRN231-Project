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
            return await _context.Actors
                  .Include(a => a.MovieActors)
                  .ThenInclude(ma => ma.Movie)
                .FirstOrDefaultAsync(a => a.ActorId == actorId);
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
            // Lấy Actor kèm MovieActors
            var actor = await _context.Actors
                .Include(a => a.MovieActors)
                .FirstOrDefaultAsync(a => a.ActorId == actorId);

            if (actor == null)
            {
                return false; // Không tìm thấy Actor
            }

            // Xóa các dòng liên kết trong MovieActor
            if (actor.MovieActors != null && actor.MovieActors.Any())
            {
                _context.MovieActors.RemoveRange(actor.MovieActors);
            }

            // Cuối cùng xóa Actor
            _context.Actors.Remove(actor);

            // Lưu thay đổi
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }


        // Kiểm tra xem Actor có tồn tại trong cơ sở dữ liệu hay không (theo tên)
        public async Task<bool> IsActorExistsAsync(string name)
        {
            return await _context.Actors.AnyAsync(a => a.FullName == name);

        }

        public async Task<List<int>> GetValidActorIdsAsync(IEnumerable<int> actorIds)
        {
            return await _context.Actors
                .Where(a => actorIds.Contains(a.ActorId))
                .Select(a => a.ActorId)
                .ToListAsync();
        }
    }
}
