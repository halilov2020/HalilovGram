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
        public DbSet<PostLike> PostLikes { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<CommentLike> CommentLikes { get; set; }
        public DbSet<Follow> Follows { get; set; }

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
                .HasForeignKey(k => k.FollowedById)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<User>()
                .HasMany(x => x.LikedPosts)
                .WithOne(u => u.User)
                .HasForeignKey(k => k.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<User>()
                .HasMany(x => x.Comments)
                .WithOne(u => u.User)
                .HasForeignKey(k => k.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<User>()
                .HasMany(x => x.LikedComments)
                .WithOne(u => u.User)
                .HasForeignKey(k => k.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
