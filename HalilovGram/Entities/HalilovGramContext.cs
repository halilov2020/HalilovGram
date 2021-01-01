using HalilovGram.Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace HalilovGram.Entities
{
    public class HalilovGramContext : DbContext
    {
        public HalilovGramContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Follow> Follows { get; set; }
        public DbSet<Like> Likes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(x => x.FollowsUsers)
                .WithOne(f => f.Follows)
                .HasForeignKey(k => k.FollowsId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<User>()
                .HasMany(x => x.FollowedUsers)
                .WithOne(f => f.FollowedBy)
                .HasForeignKey(k => k.FollowedById);
            modelBuilder.Entity<User>()
                .HasMany(x => x.LikedPosts)
                .WithOne(u => u.User)
                .HasForeignKey(k => k.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
