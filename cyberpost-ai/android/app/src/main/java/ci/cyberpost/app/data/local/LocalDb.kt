package ci.cyberpost.app.data.local

import android.content.Context
import androidx.room.Dao
import androidx.room.Database
import androidx.room.Entity
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.Room
import androidx.room.RoomDatabase
import kotlinx.coroutines.flow.Flow

/*
 * Cache local Room : permet de consulter le tableau de bord, les articles et
 * les notifications hors connexion. La source de vérité reste le backend.
 */

@Entity(tableName = "articles")
data class ArticleEntity(
    @PrimaryKey val id: Long,
    val json: String,
    val status: String,
    val sortKey: String,
)

@Entity(tableName = "notifications")
data class NotificationEntity(
    @PrimaryKey val id: Long,
    val json: String,
    val read: Boolean,
)

@Entity(tableName = "snapshots")
data class SnapshotEntity(
    @PrimaryKey val key: String,
    val json: String,
    val updatedAt: Long,
)

@Dao
interface CacheDao {
    @Query("SELECT * FROM articles ORDER BY sortKey DESC") fun articles(): Flow<List<ArticleEntity>>
    @Query("SELECT * FROM articles WHERE id = :id") suspend fun article(id: Long): ArticleEntity?
    @Insert(onConflict = OnConflictStrategy.REPLACE) suspend fun upsertArticles(items: List<ArticleEntity>)
    @Query("DELETE FROM articles WHERE id = :id") suspend fun deleteArticle(id: Long)
    @Query("DELETE FROM articles") suspend fun clearArticles()

    @Query("SELECT * FROM notifications ORDER BY id DESC") fun notifications(): Flow<List<NotificationEntity>>
    @Insert(onConflict = OnConflictStrategy.REPLACE) suspend fun upsertNotifications(items: List<NotificationEntity>)
    @Query("UPDATE notifications SET read = 1") suspend fun markAllRead()
    @Query("DELETE FROM notifications") suspend fun clearNotifications()

    @Query("SELECT * FROM snapshots WHERE `key` = :key") suspend fun snapshot(key: String): SnapshotEntity?
    @Insert(onConflict = OnConflictStrategy.REPLACE) suspend fun putSnapshot(s: SnapshotEntity)
    @Query("DELETE FROM snapshots") suspend fun clearSnapshots()
}

@Database(entities = [ArticleEntity::class, NotificationEntity::class, SnapshotEntity::class], version = 1, exportSchema = false)
abstract class LocalDb : RoomDatabase() {
    abstract fun dao(): CacheDao

    companion object {
        fun create(context: Context): LocalDb =
            Room.databaseBuilder(context, LocalDb::class.java, "cyberpost.db").fallbackToDestructiveMigration().build()
    }
}
