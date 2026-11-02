"""仮想ユーザー1,000人のシミュレーション（実ユーザー調査ではない）。
分布は公開調査の数値を使い、心理特性と「機能→ニーズ」の対応はモデル上の仮定。
実サイトの機能有無は r11_tasks.json（manapick.app を375pxで実測）を使う。"""
import json, random
random.seed(20261102)
site = json.load(open('/tmp/manapick-audit/r11_tasks.json'))

# --- 公開調査の分布 ---
P = {
    'obs_time': 0.569,        # MS-Japan 2025: 時間の確保が難しい
    'obs_motivation': 0.564,  # MS-Japan 2025: モチベーションの維持
    'obs_cost': 0.249,        # MS-Japan 2025: 教材費が高い
    'obs_method': 0.218,      # MS-Japan 2025: 効果的な学習方法が分からない
    'obs_what': 0.309,        # トライズ 2025: 何を学べばよいか分からない
    'want_free': 0.625,       # トライズ 2025: 無料・低価格の講座
    'want_short': 0.419,      # トライズ 2025: 短時間でも学べる教材
    'want_personal': 0.382,   # トライズ 2025: 自分に合った学習内容の提案
    'habit': 0.352,           # リクルートEd-tech総研 2024: 継続的に学習している
    'uses_free_video': 0.542, # MS-Japan 2025: 無料動画講座で学習
}
TOPICS = [('IT・AI', 0.356), ('資格', 0.318), ('英語', 0.12), ('お金', 0.10), ('その他', 0.106)]  # 上2つ: トライズ 2025、残りは仮定

# --- 候補機能（実測で「ある/ない」を判定） ---
F = {  # 値: 未充足の度合い（True=1.0 無い, False=0 ある, 数値=一部のみ）
    # 実測: 検索はホームのみ。時間の絞り込みはホームの「条件で絞り込む」（スマホでは閉じた状態）のみで、ジャンル・サブ・ランキングには無い → 一部のみ充足（未充足分0.6は仮定）
    'search_everywhere': ('ホーム以外のページからも動画を検索できる', 0.6),
    'duration_filter': ('ジャンルページなどで「10分以内」など時間で絞り込める（すぐ見える場所で）', 0.6),
    'plan_done_next': ('学習プランで「できた」を付けると次の動画に進む／翌週のプランが出る', not (site['plan_session_done'] or site['plan_next_week'])),
    'study_time_total': ('これまでの合計学習時間が見える', not site['my_study_time_total']),
    'backup': ('機種変更しても記録を引き継げる', not site['my_backup']),
    'speed_time': ('1.5倍速で見た場合の時間が分かる', not site['video_speed_time']),
    'diagnosis': ('何から見るか診断してくれる', not site['home_diagnosis_link']),
    'calendar': ('カレンダーに予定を入れられる', not site['plan_calendar']),
    'progress': ('ロードマップの進み具合が見える', not site['my_progress']),
    'exam_date': ('資格の試験日が分かる', not site['shikaku_exam_date']),
}

def b(p):
    return random.random() < p

def persona(i):
    topic = random.choices([t for t, _ in TOPICS], [w for _, w in TOPICS])[0]
    x = {k: b(v) for k, v in P.items()}
    x['topic'] = topic
    x['age'] = random.choice(['20代', '30代', '40代', '50代'])  # 仮定: 23〜59歳を均等
    # 心理特性（0〜1、仮定）: 現在バイアス・選択過多の疲れやすさ・進捗フィードバック欲求・損失回避（記録が消える不安）
    x['present_bias'] = min(1, random.betavariate(2, 2) + (0.25 if x['obs_time'] else 0))
    x['choice_overload'] = min(1, random.betavariate(2, 3) + (0.3 if (x['obs_what'] or x['obs_method']) else 0))
    x['progress_need'] = min(1, random.betavariate(2, 2) + (0.3 if x['obs_motivation'] else 0))
    x['loss_aversion'] = random.betavariate(2, 3) + (0.2 if x['habit'] else 0)
    return x

def need_scores(x):
    """機能ごとの必要度（仮定のモデル）。"""
    return {
        'search_everywhere': 0.35 + 0.35 * (x['topic'] in ('資格', 'IT・AI')) + 0.2 * (not x['choice_overload'] > 0.6),
        'duration_filter': 0.2 + 0.5 * x['present_bias'] + 0.3 * x['want_short'] + 0.2 * x['obs_time'],
        'plan_done_next': 0.15 + 0.45 * x['progress_need'] + 0.25 * (not x['habit']) + 0.15 * x['want_personal'],
        'study_time_total': 0.1 + 0.5 * x['progress_need'] + 0.15 * x['obs_motivation'],
        'backup': 0.05 + 0.45 * min(1, x['loss_aversion']) + 0.15 * x['habit'],
        'speed_time': 0.1 + 0.35 * x['present_bias'] + 0.15 * x['obs_time'],
        'diagnosis': 0.15 + 0.5 * x['choice_overload'] + 0.25 * x['want_personal'],
        'calendar': 0.1 + 0.35 * (not x['habit']) + 0.25 * x['obs_time'],
        'progress': 0.1 + 0.5 * x['progress_need'],
        'exam_date': 0.05 + 0.75 * (x['topic'] == '資格'),
    }

people = [persona(i) for i in range(1000)]
picks = {k: 0 for k in F}
by_seg = {}
csat = []
for x in people:
    ns = need_scores(x)
    for k in ns: ns[k] += random.gauss(0, 0.08)  # 個人差のゆらぎ
    # 「足りないもの」は、実サイトに無い機能の中から必要度の高い順に最大3つ（必要度0.45未満は選ばない）
    gap = {k: ns[k] * float(F[k][1]) for k in F}
    missing = sorted([k for k in F if F[k][1]], key=lambda k: -gap[k])
    chosen = [k for k in missing if gap[k] >= 0.45][:3]
    for k in chosen:
        picks[k] += 1
        seg = (x['obs_time'], x['obs_motivation'])
        by_seg.setdefault(k, {'時間がない': 0, 'モチベ維持が難しい': 0, '学習習慣なし': 0, '資格志望': 0})
        by_seg[k]['時間がない'] += x['obs_time']
        by_seg[k]['モチベ維持が難しい'] += x['obs_motivation']
        by_seg[k]['学習習慣なし'] += (not x['habit'])
        by_seg[k]['資格志望'] += (x['topic'] == '資格')
    unmet = sum(ns[k] * float(F[k][1]) for k in F)
    met = sum(ns[k] for k in F) - unmet
    csat.append(met / (met + unmet))

print('仮想ユーザー', len(people))
print('分布チェック: 時間がない %.1f%% / モチベ %.1f%% / 何を学べば %.1f%% / 学習習慣 %.1f%%' % tuple(100 * sum(p[k] for p in people) / 1000 for k in ['obs_time', 'obs_motivation', 'obs_what', 'habit']))
print('ニーズ充足率（平均・モデル値） %.1f%%' % (100 * sum(csat) / len(csat)))
print('\n足りない機能（最大3つ選択）')
for k, v in sorted(picks.items(), key=lambda kv: -kv[1]):
    if not F[k][1]: continue
    seg = by_seg.get(k, {})
    print(f'{v/10:5.1f}%  {F[k][0]}  ', {s: f'{100*c/max(v,1):.0f}%' for s, c in seg.items()})
print('\n既にある機能（実測）:', [F[k][0] for k in F if not F[k][1]])
json.dump({'picks': picks, 'labels': {k: F[k][0] for k in F}, 'missing': {k: F[k][1] for k in F}, 'by_seg': by_seg}, open('/tmp/manapick-audit/r11_result.json', 'w'), ensure_ascii=False)
