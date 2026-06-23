import { ArrowLeft, ChevronRight, BookOpen, Plus, Trash2, X, ClipboardList } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";

const kelasList = [
    { nama: "XII IPA", mapel: "Matematika", siswa: 34, jadwal: "Senin 07.00" },
    { nama: "XII IPS", mapel: "Matematika", siswa: 33, jadwal: "Selasa 08.30" },
    { nama: "XI IPA", mapel: "Matematika", siswa: 34, jadwal: "Rabu 07.00" },
    { nama: "XI IPS", mapel: "Matematika", siswa: 35, jadwal: "Kamis 10.15" },
];

const absensiSiswa = Array.from({ length: 8 }, (_, i) => ({
    nama: `Nama Siswa ${i + 1}`,
    status: i === 2 ? "sakit" : i === 4 ? "alpha" : i === 6 ? "izin" : "hadir",
}));

const tabs = ["Kelas", "Tugas", "Absensi"];

const pilihanKelas = ["XII IPA", "XII IPS", "XI IPA", "XI IPS"];

interface Tugas {
    id: string;
    judul: string;
    mapel: string;
    kelas: string;
    deadline: string;
    deskripsi: string;
    tanggalDibuat: string;
}

const STORAGE_KEY = "malibgalis_tugas_guru";

function statusBadge(s: string) {
    if (s === "hadir") return "bg-green-100 text-green-700";
    if (s === "sakit") return "bg-blue-100 text-blue-700";
    if (s === "izin") return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-600";
}

export default function GuruPage() {
    const [tab, setTab] = useState("Kelas");
    const [kelasAktif, setKelasAktif] = useState(kelasList[0]);
    const [tugasList, setTugasList] = useState<Tugas[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        judul: "",
        mapel: "",
        kelas: "XII IPA",
        deadline: "",
        deskripsi: "",
    });

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setTugasList(JSON.parse(saved));
        } catch {}
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tugasList));
    }, [tugasList]);

    function handleTambah() {
        if (!form.judul.trim() || !form.mapel.trim() || !form.deadline) return;
        const newTugas: Tugas = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            judul: form.judul.trim(),
            mapel: form.mapel.trim(),
            kelas: form.kelas,
            deadline: form.deadline,
            deskripsi: form.deskripsi.trim(),
            tanggalDibuat: new Date().toLocaleDateString("id-ID", {
                day: "numeric", month: "short", year: "numeric",
            }),
        };
        setTugasList(prev => [newTugas, ...prev]);
        setForm({ judul: "", mapel: "", kelas: "XII IPA", deadline: "", deskripsi: "" });
        setShowModal(false);
    }

    function handleHapus(id: string) {
        if (confirm("Hapus tugas ini?")) {
            setTugasList(prev => prev.filter(t => t.id !== id));
        }
    }

    const deadlineLabel = (d: string) => {
        try {
            return new Date(d).toLocaleDateString("id-ID", {
                day: "numeric", month: "short", year: "numeric",
            });
        } catch { return d; }
    };

    return (
        <main className="min-h-screen bg-slate-50 pb-24">

            {/* Header */}
            <div className="relative bg-gradient-to-br from-[#134e4a] via-[#0f766e] to-[#0369a1] text-white rounded-b-[32px] shadow-xl overflow-hidden pt-12 pb-8 px-6 mb-6">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-12 -mt-12"></div>
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-amber-500/20 rounded-full blur-3xl -ml-8 -mb-8"></div>
                <div className="relative z-10 flex items-center gap-3 mb-4">
                    <Link href="/">
                        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                            <ArrowLeft className="w-4 h-4 text-white" />
                        </div>
                    </Link>
                    <h1 className="text-lg font-bold text-white">Dashboard Guru</h1>
                </div>

                <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <p className="text-[10px] font-bold text-teal-200 uppercase tracking-widest">Guru</p>
                    <p className="text-base font-black text-white">Nama Guru</p>
                    <p className="text-xs text-teal-200">Mapel: Matematika · NIP 000000000000000000</p>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="text-center">
                            <p className="text-lg font-black text-amber-300">4</p>
                            <p className="text-[9px] text-teal-200">Kelas</p>
                        </div>
                        <div className="text-center border-x border-white/20">
                            <p className="text-lg font-black text-white">136</p>
                            <p className="text-[9px] text-teal-200">Siswa</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-black text-white">{tugasList.length}</p>
                            <p className="text-[9px] text-teal-200">Tugas Aktif</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-5 max-w-md mx-auto">
                {/* Tab Selector */}
                <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-100 mb-5">
                    {tabs.map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${tab === t ? "bg-teal-600 text-white shadow-sm" : "text-slate-500 hover:text-teal-600"}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Tab: Kelas */}
                {tab === "Kelas" && (
                    <div className="space-y-3">
                        {kelasList.map((k, i) => (
                            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center shrink-0">
                                    <BookOpen className="w-5 h-5 text-teal-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-800">{k.nama}</p>
                                    <p className="text-[10px] text-slate-500">{k.mapel} · {k.jadwal}</p>
                                    <p className="text-[10px] text-teal-600 mt-0.5 font-semibold">{k.siswa} siswa</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Tab: Tugas */}
                {tab === "Tugas" && (
                    <div className="space-y-3">
                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full bg-teal-600 text-white rounded-2xl py-3 flex items-center justify-center gap-2 font-bold text-sm hover:bg-teal-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Buat Tugas Baru
                        </button>

                        {tugasList.length === 0 && (
                            <div className="text-center py-12 text-slate-400">
                                <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                <p className="text-sm font-medium">Belum ada tugas</p>
                                <p className="text-xs mt-1">Klik tombol di atas untuk menambahkan tugas</p>
                            </div>
                        )}

                        {tugasList.map((t) => (
                            <div key={t.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-teal-500 mb-0.5">{t.kelas} · {t.mapel}</p>
                                        <p className="text-sm font-bold text-slate-800">{t.judul}</p>
                                        <p className="text-[10px] text-slate-400">Deadline: {deadlineLabel(t.deadline)}</p>
                                    </div>
                                    <button
                                        onClick={() => handleHapus(t.id)}
                                        className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0 ml-2 mt-0.5"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                    </button>
                                </div>
                                {t.deskripsi && (
                                    <p className="text-xs text-slate-500 leading-relaxed mt-2 pt-2 border-t border-slate-100">{t.deskripsi}</p>
                                )}
                                <p className="text-[9px] text-slate-300 mt-2">Dibuat: {t.tanggalDibuat}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tab: Absensi */}
                {tab === "Absensi" && (
                    <div className="space-y-3">
                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mb-2">
                            {kelasList.map((k, i) => (
                                <button
                                    key={i}
                                    onClick={() => setKelasAktif(k)}
                                    className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${kelasAktif.nama === k.nama ? "bg-teal-600 text-white" : "bg-white text-slate-500 border border-slate-200"}`}
                                >
                                    {k.nama}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 px-1">Hari ini · {kelasAktif.nama} · {kelasAktif.mapel}</p>
                        <div className="space-y-2">
                            {absensiSiswa.map((s, i) => (
                                <div key={i} className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-600">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm font-semibold text-slate-800">{s.nama}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full capitalize ${statusBadge(s.status)}`}>
                                        {s.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Tambah Tugas */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />

                    {/* Sheet */}
                    <div className="relative z-10 w-full bg-white rounded-t-[28px] shadow-2xl">

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
                            <h2 className="text-base font-black text-slate-800">Tugas Baru</h2>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                <X className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>

                        {/* Form — scrollable, tinggi fix supaya iOS bisa scroll */}
                        <div
                            style={{ height: "52vh", overflowY: "scroll", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
                            className="px-6 py-4 space-y-3"
                        >
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Judul Tugas *</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Latihan Soal Integral"
                                    value={form.judul}
                                    onChange={e => setForm({ ...form, judul: e.target.value })}
                                    className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Mata Pelajaran *</label>
                                    <input
                                        type="text"
                                        placeholder="Matematika"
                                        value={form.mapel}
                                        onChange={e => setForm({ ...form, mapel: e.target.value })}
                                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Kelas</label>
                                    <select
                                        value={form.kelas}
                                        onChange={e => setForm({ ...form, kelas: e.target.value })}
                                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition"
                                    >
                                        {pilihanKelas.map(k => <option key={k} value={k}>{k}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Deadline *</label>
                                <input
                                    type="date"
                                    value={form.deadline}
                                    onChange={e => setForm({ ...form, deadline: e.target.value })}
                                    className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Deskripsi (opsional)</label>
                                <textarea
                                    rows={2}
                                    placeholder="Keterangan tambahan..."
                                    value={form.deskripsi}
                                    onChange={e => setForm({ ...form, deskripsi: e.target.value })}
                                    className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition resize-none"
                                />
                            </div>
                        </div>

                        {/* Tombol — di luar area scroll, selalu kelihatan */}
                        <div className="px-6 pt-3 pb-10 border-t border-slate-100">
                            <button
                                onClick={handleTambah}
                                className="w-full bg-teal-600 text-white rounded-2xl py-4 text-sm font-bold hover:bg-teal-700 active:scale-95 transition-all shadow-lg shadow-teal-200"
                            >
                                Simpan Tugas
                            </button>
                        </div>

                    </div>
                </div>
            )}

            <BottomNav />
        </main>
    );
}
