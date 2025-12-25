import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    Legend,
} from 'recharts';
import './analitycs.css';

// Página: ArtistAnalytics
// - Usa Tailwind para estilos (no requiere imports)
// - Requiere `recharts` y `react-router-dom` instalados
// - Endpoint esperado: GET /analytics/artist/:artistId/stats

export const Analitycs = () => {
    const { artistId: paramArtistId } = useParams();
    let artistId = paramArtistId;

    if (!artistId) {
        try {
            const stored = localStorage.getItem('artistData');
            if (stored) {
                const parsed = JSON.parse(stored);
                artistId = parsed?.id;
            }
        } catch (err) {
            console.error("Error reading artistData from localStorage", err);
        }
    }

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError(null);

        // Use axios to fetch artist analytics
        axios
            .get(`https://blackamp-api.onrender.com/analytics/artist/${artistId}/stats`)
            .then((response) => {
                if (!mounted) return;
                const data = response.data;
                // Normalizar datos para el frontend
                // Esperamos: { totalPlays, topSong, topAlbum, songsStats, albumsStats, monthlyPlays }
                const monthly = (data.monthlyPlays || []).map((m) => ({
                    month: m.month || m.month_label || m.monthly || m.monthName,
                    playCount: Number(m.playCount || m.play_count || m.playcount || 0),
                }));

                const songs = (data.songsStats || []).map((s) => ({
                    id: s.songId || s.songId || s.dataValues?.songId || s.Song?.id,
                    title: s.Song?.title || s.title || s.name || 'Sin título',
                    playCount: Number(s.dataValues?.playCount || s.playCount || s.play_count || 0),
                    albumId: s.Song?.albumId || s.albumId || null,
                    albumTitle: s.Album?.title || s.AlbumTitle || null,
                    albumCover: s.Album?.coverUrl || s.Album?.cover_url || null,
                }));

                const albums = (data.albumsStats || []).map((a) => ({
                    albumId: a.albumId || a.id || (a.Album && a.Album.id),
                    title: a.title || a.Album?.title || 'Sin título',
                    playCount: Number(a.playCount || a.play_count || 0),
                    coverUrl: a.coverUrl || a.cover_url || a.Album?.coverUrl || null,
                }));

                setStats({
                    totalPlays: Number(data.totalPlays || data.total_plays || 0),
                    topSong: data.topSong || (songs.length ? songs[0] : null),
                    topAlbum: data.topAlbum || (albums.length ? albums[0] : null),
                    songs,
                    albums,
                    monthlyPlays: monthly,
                });
            })
            .catch((err) => {
                if (!mounted) return;
                console.error(err);
                setError(err.message || 'Error inesperado');
            })
            .finally(() => mounted && setLoading(false));

        return () => (mounted = false);
    }, [artistId]);

    if (loading)
        return (
            <div className="loading-container">
                <div className="text-lg font-semibold mb-4">Cargando estadísticas...</div>
                <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    <div className="h-40 bg-gray-100 rounded animate-pulse"></div>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="error-container">
                <div className="error-text">Error</div>
                <div className="mt-2 text-sm text-gray-600">{error}</div>
            </div>
        );

    // Si no hay stats
    if (!stats)
        return (
            <div className="empty-container">
                <div className="text-gray-700">No hay estadísticas disponibles.</div>
            </div>
        );

    return (
        <div className="analytics-container">
            {/* Header / KPIs */}
            <div className="analytics-header">
                <h1 className="analytics-title">Analíticas del artista</h1>
                <div className="kpi-container">
                    <div className="kpi-card">
                        <div className="kpi-label">Reproducciones totales</div>
                        <div className="kpi-value">{stats.totalPlays}</div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-label">Canción más escuchada</div>
                        <div className="kpi-value">{stats.topSong?.Song?.title || stats.topSong?.title || '—'}</div>
                        <div className="kpi-subtext">{stats.topSong?.playCount || stats.topSong?.dataValues?.playCount || 0} plays</div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-label">Álbum top</div>
                        <div className="kpi-value">{stats.topAlbum?.title || '—'}</div>
                        <div className="kpi-subtext">{stats.topAlbum?.playCount || 0} plays</div>
                    </div>
                </div>
            </div>

            {/* Layout: charts left, lists right */}
            <div className="charts-grid">
                <div className="chart-card" style={{ gridColumn: 'span 2' }}>
                    <h2 className="chart-title">Tendencia mensual (últimos 12 meses)</h2>

                    {stats.monthlyPlays && stats.monthlyPlays.length > 0 ? (
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats.monthlyPlays} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="month" stroke="var(--colorSecondary)" />
                                    <YAxis stroke="var(--colorSecondary)" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--colorBackgroundSecondary)', borderColor: 'var(--colorPrimary)', color: 'var(--colorText)' }}
                                        itemStyle={{ color: 'var(--colorText)' }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="playCount" stroke="var(--colorPrimary)" strokeWidth={2} name="Plays" dot={{ fill: 'var(--colorPrimary)' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500">No hay datos mensuales para mostrar.</div>
                    )}
                </div>

                <div className="chart-card">
                    <h3 className="chart-title">Álbumes</h3>
                    <div className="album-list">
                        {stats.albums && stats.albums.length > 0 ? (
                            stats.albums.map((a) => (
                                <div key={a.albumId || a.title} className="album-item">
                                    <div className="album-cover">
                                        {a.coverUrl ? (
                                            // eslint-disable-next-line jsx-a11y/img-redundant-alt
                                            <img src={a.coverUrl} alt={`Cover ${a.title}`} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No cover</div>
                                        )}
                                    </div>
                                    <div className="album-info">
                                        <div className="album-title">{a.title}</div>
                                        <div className="album-plays">{a.playCount} plays</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-gray-500">No hay álbumes con reproducciones aún.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Top canciones lista + gráfico de barras */}
            <div className="songs-section">
                <div className="songs-header">
                    <h3 className="chart-title">Canciones — Top</h3>
                    <div className="text-sm text-gray-500">Mostrando {stats.songs?.length || 0} canciones</div>
                </div>

                <div className="songs-grid">
                    <div style={{ height: 300 }} className="p-2">
                        {stats.songs && stats.songs.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.songs.slice(0, 10)} layout="vertical" margin={{ top: 5, right: 20, left: 50, bottom: 5 }}>
                                    <XAxis type="number" stroke="var(--colorSecondary)" />
                                    <YAxis type="category" dataKey="title" width={150} stroke="var(--colorSecondary)" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--colorBackgroundSecondary)', borderColor: 'var(--colorPrimary)', color: 'var(--colorText)' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Bar dataKey="playCount" name="Plays" fill="var(--colorPrimary)" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-sm text-gray-500">No hay reproducciones de canciones.</div>
                        )}
                    </div>

                    <div className="songs-table-container">
                        <table className="songs-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Título</th>
                                    <th>Álbum</th>
                                    <th>Plays</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.songs && stats.songs.length > 0 ? (
                                    stats.songs.map((s, idx) => (
                                        <tr key={s.id || s.title}>
                                            <td>{idx + 1}</td>
                                            <td className="font-medium">{s.title}</td>
                                            <td className="text-gray-500">{s.albumTitle || '—'}</td>
                                            <td>{s.playCount}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-4 text-gray-500">No hay canciones</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Actions / Export */}
            <div className="actions-container">
                <button
                    onClick={() => {
                        // Export CSV básico
                        const rows = [
                            ['title', 'album', 'plays'],
                            ...(stats.songs || []).map((s) => [s.title, s.albumTitle || '', s.playCount]),
                        ];
                        const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `artist_${artistId}_songs.csv`;
                        a.click();
                        URL.revokeObjectURL(url);
                    }}
                    className="btn-primary"
                >
                    Exportar CSV canciones
                </button>

                <button
                    onClick={() => window.print()}
                    className="btn-secondary"
                >
                    Imprimir
                </button>
            </div>
        </div>
    );
}
