'use strict';

const obsidian = require('obsidian');

const LIVE_VIEW = 'pie-tasks-live';
const DEMO_VIEW = 'pie-tasks-demo';
const DEMO_FILES = { planner: 'Pie Tasks - Day Planner.html', studio: 'Pie Tasks - Studio.html' };

const SKIP_SECTIONS = ['Metric nhanh', 'Priority tasks', 'Quick links'];
const PT_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAIAAABMXPacAAAAAXNSR0IArs4c6QAAAHhlWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAAEsAAAAAQAAASwAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAICgAwAEAAAAAQAAAIAAAAAAHeJAawAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAcNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDYuMC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj4zMDA8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjMwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CltpsyQAACavSURBVHgB7XwJeFvVte4ZpKN5siRblizPduIpzjwPZCJNE6YWCoUwtZRSoMCFXt6DctvS8l1u+3rLKzRQyoUytUAJY4AECBmAmMyJEzt2HNvxPNuSNUtH0nn/1kmE4yi2E4L9WnTiyEf77LOH/1977bXXXtt0MOChktfEIcBMXNXJmgkCSQImWA6SBCQJmGAEJrj65AhIEjDBCExw9ckRkCRgghGY4OqTIyBJwAQjMMHVJ0dAkoAJRmCCq0+OgCQBE4zABFefHAFJAiYYgQmuPjkCkgRMMAITXH1yBCQJmGAEJrj65AhIEjDBCExw9ckRkCRgghGY4OqTIyBJwAQjMMHVJ0dAkoAJRmCCq0+OgCQBE4zABFefHAFJAiYYgQmuPjkCkgRMMAITXL3ka62fYRiWZWnm5DiLRiKhUEiCS8pRFC1Ew3w4TAnC19qG/88L/7oIoGlaEISBgYHurq6+vv4wzyuUCq1OV3O0Zvv27QB9+vRpCxYunDRpEs2yYdDwTb3oC35ID1IPAQ8FA6+88tpzzz13+HAl8JVJObVaqVIoU1NTFWr1gQMHnU5Hlt2+du2a2++8M6+gAAyBs0gk8k0j4kISANXCsFK3y3n48OEvKip2795dVXW0u7ubZZloVAjxIU4i0arVOp1WqVT29Q909fQadNrJhYVLV6780Y9v9Xt96db0bxoHF4YAKHpWIqmrPfbGG29s2rSptvaYz+cDH0qFnOOkkUgUFzRSOBwJ8bxBp7Omp0mlUuRp7eg0aDUKuXzpipX2zMw5c2bPnjM3HOa/OePgAswB0Dltbe1/+tOf/v73Vzs6u1iG1mjUxpQUGScNhEJ8OEJIkEqRDdLt8/v7HM5Bt1uv06iUSoVM5vL4MqzWz7Zvn1xS0trcPGfu3G8O+ujpBSAAuhsFZWfnWCwWCC9wl0pYYO31+eRyudloVCjkMH4cDqfL7cYI4KQSjIbO7j5OynIcFxWohuYWqKZPd3w6a+Z0lMXJFDCQcCHbvzwZX5UAyDUw+vjjT554Yn1/fx8k3R/wu/kwkNVpNYAV0h8MBrt7er1+H0TeZDSCH7wFC9Tt9fYNOAB0JBIGW+Cspb3j+edfkHFcQWFBcUkJ+MPTf20OvtIcAByhYR5++JGn//IM5DoS4f0+H7S9WgXlL2MYGtMATTP+QFDCsqlmk1qt4kOhQZfL4/ViTEglUswMXT19yAlZxyf4o4Roil6v02q/c+WVN918s9VmxfzxL8zBVxsBNP3YH/74l2eeBb6hUNDrcWPdBTEXKMHt9YAJItt8BEMhJdUERTU4OAhFhM+YXANyVqlQqBQKF15kWE4mU2NWUBCpd7vdO7Zty87OWnfDDf/aBJz/CIC01tc3XHX1urpjtRB/j8etUCqhwQOBgCBEaRikEklsHDByTooVLxRREDNAOIKnkaiAnFKIvIwD9F5/AOaSjJNB6UNlZWXYeJ4HBxqN9uln/jJj9myMm3EYBJyUoSA7AkUzdKyd41AndZ4EQJyx3vrZ/Q8+8fjjOp3O43EpFUo4HYA+Wg3ciSTLZEGeh3L3+/00RacY9JieXa5BqCk+IoQh2FFBJmWisb9XAaWllCtUKiVKBh9pJhMGj8fjzczKenvjuzIZ4WYEPIgZkOga6Z3T8zM0vflg15ZDXXxYmFlguGqBHW0bsc7T3z/fb+epgrDW3bHjsyefXK9SqYCUSqmG6wGqA8NCjjlUImEZxuPzudwe6HqNWm2zpqsU8rbWFphC6JUE3YUziKbAAR+NyKQS3EHuMD9DC2lU6qbWNkwjmAr6+wcqKiouvngVVNwIfUwINMrnWIZiaIw4DLwRXodZ8MG+zvv/WgmaYdR9eLBzwB269/JJfPhrn37OkwBKoN9/7/3iouLe3j6XyymRsv6AT4hSWOJGopFAkKy9oHFC4TAsGSx3MbDb2ztauweAAgvlQws2LYeuqhUyjy/YORj0gL1wWCHjnOEIyDPoda0dHRg7SxYtstls4DghfGARuP76tepjbW4JO3wYQApMWllppnZJaWq+VQ2zFnN+4nIYetexfkiDQobWYXBT+BoKRxn6a3cVnicBoVDguuu+39re09BA9IPX64ZZKY4GPhQWV77EElUooFQDwSAWvSreNdemKM82XVRqz8+2Wi0mqUKBpYC7t+e193e+u6+psi/Y2t6h1Wj4SASrZcwNoWDweH09UhKiFk9s6PQePuHEUi+ecvJGoLDI2LS/85mPGq+cb79tdZ6CYzH9DM8W+56TpoJWjERJIYFQJNOslLIMepIw8wVMPE8CZHIZfMp79+3DMA8EfEBKLlei/TwfIsIvULBEsSKDAQonhccfyFEJty2wL5lVlFeQJ9GbKLmaYjlYQVQ0rDOa7rOmzsireGLjvs1NIa/XA2celsrQZDChTjQ1Hz9+3J6VhVXC2boN2YcOAV5ny+APRcBBc6/3v24sl0mYM8cBz0euXGDvGPB/Wt0biQjFmea7LykcedY5W13nmn4+BMDZ4A1En3hhY1d7Myz9AFCWSDEHAG4McpjzMIrwFQoEHeM4AbbFTXOzL1tWbrDZaaUuKlNSEvxwxNoQsNyN0Cr94ovmhCPhztcP7OmOaFiJ3+eXSKWg0pxqUWAYnUV1nNlbZIQgi+nib8ylmHGUMvajg92F1safXlIQ4ocPAryl5Niff6/4Dg8Uj5CixnYFdbaxcmalXyXlnAlAZ9DEX71S/cbmzzG9SWVyBUXBTMRohU6XyiQRqE6GCQZ5OsKrOIk7FF6ep71s/iS91SqRqwVWQtEsBYOJlWK+A2EUbiQyWqldvHDm1S0De9+pR8+xgJBysFElanOuR2anqbOK/9DOY6Yttmt/uiYfMy6Gptsf3lLZ9UllDyQG2cDEG1+0QdJTdTIRXE5CpuihJRh0MvIVumsMygcjjxGHHXqBYohRIfAoeji/Q2sYfn/OBAC6x9489tbO5uWzCwfMvkPVdfD/QFqj0TBDs5gJsPQFfBIhXG5i6tyURUnfsbzAlG5hpXIB7EHtEO8F7FL8ZikJTbGwijDxRbmo4bJl0/+8q7MrwKrlMtApl9BBWvHLV+usRlVxpnZUmwRdN6i5hVNSie7HRdNrZqX/5tWjr37aAhsfNPQ6g4ebnKumW4AS2lJR09flDGCADEMFTwvSNaiRKNNEF4rCz/EOz57j/Y1dXrefx4Rv0cvLc/Qz8g1qhSTEj3XyODcCOI59f3fHU5sab1qk/9mq66++5ZjPOwhlDZkB86wQNSqZvoCgkwhLs1R6paym2nHXivx5UwskKg0N2SfLLwoWJ8NJKI5zekJ1Te21Da2DTsfMgtR5eabsgtyfX1J258v7GKUKywSald19/YrX26IPvXzkr/fMVsslZ0MkjhI4iPJRjFExBXPDVQsy3tndjsEBAcUisK3PR0QVxhhDP/9J05bD3fIzZm/MGT9ZXTAlVx8KJRh5wLrfHfzTe8c3H+ga9PGkrFi3IPh4NDlDc9fagsWl5jFycA4EQPbben3/uaF2Rrb8vtUpSqV09rTJew8c8rhcAAtr3WkWeapezQqRcotiRq7pRI/n15nG76+aoTOZKeh9Vkr+RiBgFcLb91S9+Wn1Z5UNbR19fDAAq5SVSm9YO+s335t19cqpb+5t+qCmP0WnMZlM166eXtQtu+XZ9qc+qH/gqqLQKWTjiI98AxWnlMFIJoNSzIk1YPwV0COXslBN8RTxJgZlDNRhD2K09Q4G7nrm4KFGp5xjRLMKIwacwsWIz5pW193PHHz42pJL59jGwsE5EIDin/yg3uEOPHV9hkrOQObvuvWaDz7+/MjROj7kxxyQn6pbPNkmhIODQb6izef2he0WzXs1jhIfU14AlcIStUMJx+pavnvfs8FAoCBNs7rIXFyYlZ2TIacjfpc7wodlesPNF0/98NgnGFJmo0Gl0SxNla2br3vhk+ZV0yzT8gyjKiKgEBNxAh5sI+gcd4AXbSSAatSQCVa8UEWQx9RFvgF0mA4EwpEvmv7DO3WHGh3gFRnRmPQUhd2k9AXD0EgoEPMKxt9v36gttutyLaqRF4AoYawEQFgONjjerGi/eZF+SrYsEjMkdFr1Q/fdcs/Pf9/c2spRkZJsqyHF9PhHB3c19hA/D8MIdHuQP5xhVG5+cHVulp2SyihWomeCv/x2wYk+r4OntHoN7I6Gtj5PmAmGI0xlR3mWyWhNL51caGBC/7G2QHpsK2WZ9JMV9o+rPE9tanjq9hlA6EsZPgMsPEKfAQGy4XNnTfcfN9aJsAJioFZk14oTLCyr0kwdhFfkBhNBTZtrwBMagQNomJrWwS2V3Qqo0Bj6EPP7Lp+kU2EKFCpq+x966QjIxjq/3xXaUNH6v68spk6NvDNaejJhrASgYy9ubdYq6BsX6IRToxi2+Zo1F727ecfzr3TKpUJeVlZtlxPG+1XlaSE+4vQGAyFeq5BOsaj6WttSFFKtKZWWK/QamZdi3YHwddMtBRlmsMIIYXgdPm913/bU+xhbi6cXaeXcxSWpCwrSDv39JWOq0X7nIzctSfnde7176/rnTjadbRAAyqMtg+se200ooilfINza58esAHWP7gb5yEVlqZNsWlEqQc8da/LjEo85+q6n92851COTnnUQMCx9oMHpDYSheYC4WSe7+5ICDCmYrijnovK0tbV9L2xtknPYn2X21zv8wTAsJRA/wjUmAlBKfYd7S2XP9fO1FpMkEhpSZCRy7+3rPty+xzPQozGYUty+DIPSoGYztJyCEULBUNMg303p6jpcJl03o9YpZMqPvqg50tjzHytyD3X7n377WHeATtPJ81XhddPTb5yRumF/+w+LVA8eb7bbCv19ffnTpvlO1EQaq6+YOee57QMbKtpBwNn6AxS8gUh1y6CYAXYUMVdiGAMjk0521yWFSImrBYh/vChsRIyMlJiz0wHHIrnAX1aqKs2oxHuwTWJpTFm2XpyQwbjDEwJVehUHX0DsaeKPMREA6dhyqBvyfuk09TCLHKMhL9u6esnsDe9teXbL3vrm1h/MshSbuQ6nv8UddUc4q4bI4osHQ3ua+wcp+BXU2w43//6q6S5W/kJV/4d76mfOnK3QGzNnTd2y962Z2aauiHz2whkz6n20o6cnFLKWlnC2jKjLaS6VrJ6i3niot6PfbzHIh2I3tGdAW1QpYiIwBVJAH56Gh68thf7B0Bya/1zv4/WCyG5n4A9v1sb8LrB7iRfvRLcnPtmgasIv6BoJ/zHMASgB1ti2I71Ts2SFFi56Sv+g6Qh58w7073zxaWv3oRyz5vPKQ98uyy9M1Xxc01YvmCVK7YYt28umlOfSvXo6sLvB9+ilkzz+0M5w0Jiepk6xrF5dcry6pmbfniLL0u8snemhD/cKCpWjl5KrFhZZLbzL29Xu6+3BPhqlUKE33ypTv1wxuKdu4IoFGZFEBiKahG7D1hSFFJ8yKZueIl82JfXqhZmg7SuiP5QtENDe7396c308ETjDEMJMTkzh2E/80Qg3o48A1NTU4z3W7r5tqY7l6KH6B06bEzs2Nez4yGpMyVaGe7RWi9EQEtgAxf3k1h/u3r33ow+p+rpjylxrjlamGPQWTCqw5OQ9uf3/vrPvxKO3FCstBsW65Q7HwJrLl5kdh7UZ6ceb3WaDFlgvKbLLEUTRo8MGG8VIKCOMK6HYxtn0Esx1V8y3JewSdAtWT3evLQAHYAIGCZwKsFI0ShIag3GQ8K3zTkT5OiVs6wQXZgiNAu6ZBI+GJY1OAPQP0IeHeVqWjDqjC972JhlZz7MFeklUm+rlo1q14tKpNp37xOK50zuqdnd2di2ek1Nx8CjQwX6LMiPzumXlz+6sj9BCdqT5puUlUpWWlmGmkipVyq1VRy9bPA0qAzN5IOBSGlIYbJMp9JTeAk+fRsmW2uVVLYOYXWGVAeJhF+TOoOLml5hjg588RAqUxgUU/HiNMATK8gyP3jAFVcQTh95gVaBRjL5yHJ0AaLG6do9aTmcbpfGOxWvSpVnghfbwvNTVV5abdazHhQ0AtZRju6szot2/uHYR7/d4+nqqq6KsQUE89iH+2ssX7altWf/JsXu+O59D69F+KUcL1LMfVMiUyvmFqZi8otjkMZpZhUrwegTbZBrruGgEPBdbZZ8fd/W5QjajAmIeb0b8hoz98Jcr4Xh6wpuhAjr0Pp45nhivCfpAfIoUCLg1hTgKv3yKHsbFXgDxZwhsvOhTN2MgQBBa+3wmDatXskOsBlKAEI2aymZJN70LHxDH0JOM0qAkbW+b+9qpqZxCLlHIJPBa62TVHl+vh/9+eTrwpfiAXKH41brFj7766b0dAwtml6llbEevY+/+Krsi8tC1K7BHirESCYaYCBcZ7I8Yc1jbZII+qY/KMiHYK9IzGLCbsfMT7zh5OD4XQTxWE4z9ph5fl8OfblSIZjEGZV2bu98dguyDFKw54JYYtVWjEwD/OCTOpJHIOfqUo/dksYieSiksSyspDxw+iGa1tzR9e9Gyt/Yce6u691vF5jSdJsJID7T0r99YecXU9PwMk1KlouQ6vGzJyfndvVmf7zlyYNtmdyiaopbfWJo+p7yAwoZCmI9GpYOs3tXeb5pcri5dRKLbsdmGS6DMGhZ9w35hXM5ONuUcf2H35u1d7a/uaIn7IU7aMPCPIjJMymze31l5wikKdzAc/dHFucunpmEFNyPPAJcURAQo97uCv32z9t8um4QFAVmI1fT/6pUqYIX2+oORaxZlPnxd6dmWLPH2jkIAxhsEzRMIp8ixQsS3YUInMKyk7Ps/6m1+MJ2VeSKUz+26ssy2/WDVw0caBAkbCIX1HHXH0iJllG/rcdccrEzr7OzvHZArFZnzly3/Tv7yoDvWFJrig1GfOxrwwZ/KU3TmsstZjQGeASL7IvrIR7z2ZKHqC0a+HOnxrpzLDfrS5QjsrR/ANoD4HjpG3MsxYvEJE7N94KTJ7+cjV8yz4RV4GiZlaOEReb2iVQUXk4RY53uPD8Tsq2hbvx9YoRDQY9TKrl2SJfI3crtGIQATALqPcs+23QRlrbPnzPvJ/Qf/8ZJ7oLuntV6ZO3lOhm6KDt5P2mYz5RdkQS/vrDh4vKWnqaPLbmgtLCk2Fc+gJVIh4PN2d0SCfpVOTzbOQ8FwGGHtobBKx8gR4YKKh/ENFybpzgVRPtDmMGMAYkKAIODgWnyEyUYkBl+B6T2XFWJzbe9xB5xxeB3SiTkSQKFA/MC5hM2fh75XPHlsa47RCED0FGILJEwoPByLeLsjfMhSOm2e1nDo7b/1ONyszhjp69Dr1bZ0vT5FF4pEPW6PVqspyGE1WlV2doY1vwC7khD24EBPU30DzQdyCvMkrDTMB6GBAoGQxJbGyuRCoo144suE1ww8DGkOhjm6jRkBhiaENN6wkW/AIt6KIztCZmSLU44b+B4ev3U6vLPv7+vEchcNEVUDQrqh0GbmG+5cWzC7MGWMptcoBKB09FarlDgHSRjP2VoJDnQZ9kW33w+N1Fl1+Gh7YyAY7h/0YXUolXNH69slnCzDZkZ4hEqlcbS08HWNwBeBcAUz57IRf2iwPxT08zhBEAgGolJzTglZUJ15YZMrQBoB805UhmKmn64tcHp5oq4E4uxMaB0NKywcji6fkmo3KuJWzbAM4ldMP2AIVnGJXYtXxERoGJj/2L+Ektnf4Gjo9Lj8xNtqTZFPzTFMydFjg2Es9o9Y2igEIBP0YqpOfrxtwBuMqmXY0RZfHP6J819IQtCbMTdPkWYbbPE4fCGaoaxadYrRcKKpPdDv9Cv7jAadJsWoMpnlWpVUJcdGGIQWK1eoHuwtu90B7YyLFeb0hOKPYd7pDAMTeHXi8wIqXVBkIlv8JN4FFw6eBWGLxu5PfiBaiezExS4+hKcw34T8dE2h3YD+QaVhlwL9JD+4BMw66CTZs3M5B71eryUtDY/jgwBZcI8fRE7kpKtjr5zMDxHAEESHsFWOdATakKcjXqMTgHbkWpTv7o70uyMaOZtYNk/VgZ5xSmXW3MUHO1q8viCmb7U3kGlPS9Ep3U4Pwq8Qr+vjPUyAkapwXgARCrHoUT6MTWWn0xNWp5nK54PFU+Wd/pumTvTyEH9YHUPFHLF1e3fv3fFZhdfrL5qUv/pbK+C9iEdRAItDlUcqD1cDDkTQXLp2FYKXwEEgGGqsqUMMpNWabjIZEQnZ1NwM1LOzM5EBPCCk7N33P+rrG7joooVTykrB7OmtidFwhkcEczViMBsbm7CAzcvNQVDIsLeGfR0DAVEBLtwAT9V189kW7szF8LASYZvaSkr97kuPfLDB6XXS7X0Bf1Am4xRqEnaICFC1Hv5Sk0SuIDojHISw41+/w9Pe5Zg8vxxbY2cjQAhTR9oCWWYlHAxkNz92STnu+Rde+cXD/zXocqN8hmZWLF/y9JP/Da8flCaevvramw889AiCgkGAIcVw0eL5ajV5BOh37d7n8XjKyoqXL1/a1NS849OdCOkzGlPAH4YImLPZrJyUSzEYkF+sDvjiBvzFb8T0+FMMUISD7KzYhbCoTLsdhSDz0DzD7kcnAN7E/HS1QcPtafRfXK4a9n7CrxDr/HkL1CbTwY0b+tobo4IrRatMSdHp9Vql1gDfA6PSYeYSAu4o4im8nhNNHXUN7ZNzLCoFdMtp2iNePozrHle4pj10xQIL3L/ibi1629vT+8T6ZwDQw7+4v2jypN/+/o8fbdn27sZNN914HYnMDodffPkfiIb/8Y9unD59CmLucEItjibgRuR2b09f0O/v6OgCZ4gexojHJWqPuXNmIzMCJuOvIB2AAlyIOe5jY+UkH6AE8Wc4qxU7rwXkR5F9sWujEwBZSNXLp+XoPzs24PNjWwXevjgsZ73BOEgvLFLfeNumx3/X6+6PUgGEPSsRr6sIMgEPlDCaK+A4gdNx4FBtY3NneVG2PTMd28XE9qMxMwynAX79fScCDl+UaPxTMoXjfz29OO7nsFjSfnDTtTqdcf+BQ3v3Hmw80Yw8AwMOP6LGfF7Eaa9auXTe3FmQejHO96T8RqMarcbr9TW3tiFqXm/Qd3f3QAvhyMiWLdsGB12ItkdTZ8+amZubjSYB8Y8/3oqQy7y8nKrqGnyFvpo3dzbAxtM9e/bVNzSi5MLCAqScFZrTH4wpH3aCVk5N+1+V3fubAouK4E4YAwOYqfiQxmwypKXXtrVgahKwpMYRDpzLwEKTwY5SdMDpOlzb5HF5Zk4pyMmzI7YlGPTUVNdas7P0eg10xCmcSZMxrb53yJ2Zqpyao4cUnt4LRLjQABe5CLKIfaEZTLY3/ODOpqYWBEZCYH96zwNIhfhveOXZtLRUkWCYtBALhlEfPlyFEuArFNNROMBFmEEYhgEJccXC+6TmQbgxZgsk4iQDCK6urjGbjGVlZTW1tZWHq1BRSoqhoeEEXoFPbFgjE34dEwGItVpSaobz+LXdroWTMEGNcqGxWKJQEsn+fdXdgwE45YH1gJOqb+tFqA/WdjDpELmODcs0g3re9Mn27AxOrkAIMxcNHXj/H/dUdP/7z25duWQaoES0BcBGQEZte3BHre+Wi/N02AI8Y+pL0CCahnoxGHQ9vf2YkNUaFcJncHoQWmtIZjhXhLRU8649+4onT5KwJ/U1tMfKlcugSb74Yk9V9VERffEt8AQVNHv2zILCvE8/3Xno0JGenj5ore6uHtRSWJi/ZPHC5uaWzR9uGVLLSLdjIwD7nwb5d+dZn97cUNkcmJotj5whg2IlULLwpCBY4Eh1w+vvfbb+z3+9bXFhmRnBAdDHFE7CdAcCGOBwGsJvXGAzFhXY0+0ZnFJFBBd7KXzo0mL9/2yqvvXe/16zYs6tN6wtK85moEyjkRd3DkIXXzbXKm6pj9Qn4oXG9Ct77n8eR9Dqd753U03t8f/z6C/nz5sNwYRJCqTimGLTND8/D3opPd0yFGukEC2eyIYBhTj8hvaKUcPiHIt9MTQJKShZrVHHXhw+TBO2eUwE4E0MgqsXZf5jZ/v6LY4//8BCxHhI+aiViDxNw8+zfWfla+9s/WzXkb6BATvntaVoo4If6xToawT/q2J7rxoFZ0/V52RaTKkmuEjx1wqIgsLhMqXkrV3NjU50JvD2+9u3frZ//uwp116xWJGa99YB97qLsvLSNcNXmAAgZpMALTJ7xARcBAXnQdBKEWvgDosIHREfiVigF5AMHDBJSzNjKMBajafjLfFCCm5QbFw7xQsZWpT4IvlEbnEe/zJppLsxExAVbGblratyfv3q0Xf3e66YoxG3xjAkEYvL+4O7dle9sXHHx5/ua2xqg/MHzgIpS9l0Usy0EcTnEsYicFSxmIo5Jt2ks6WbMOkBfQbzFciMhlVy6d7j3b/eeAJLTQg91A4WQZu3VHz2RaVmwY/TUrNvXpGDja2hvQFn2I3A1O4YcELMi4sltbV16D90PbIBoDhG5GbI16GFAFn4YAlup2QKX51OFwYApgCkoxn4cxcYf1DxQ18cei/Sj+MkWFDizASmjxEyn/bi0C8j38NPfM3iTETFPLqxrzxTlmshQT4uh3vTu5+9vGHL7gNVbo+XpUlkLuLfiDWJpgfDA31dMpMBMx1i01hG4ORSLMrMKRqdTi1TKXAyD91GftCyrbLt3peP9Lix20UcBAQNeLioMJO10M2lP7g212pSDtP+KNNuz7h45dKX/v46plwo/abmVrvdunrVCngJxe5gcsY0CgE/s3fQRUPlGvdEOyGEtLd/43ubAD0ogzLZt//grt17y0pL5s0jVinyiLzi82QJgmDLsMIuOl7fiKPqqAjvIt+ZNZ6ZMtYRgDch14iH+cXVxev+sOeB13sfu8awdduup158v7q2ARoeIo9oJaIJYa/AyqQExIO0+iRNXX0aGfZm5Uq4AwRGreRMehUiunAmEuecoJkQUO0JhtdvPv7Ee7WILwP4pAgS7AejNCi3z4hkLrlyjuWyuTacPTizA8j8m4cfSLekbt3+ud8f+Pa3Vtx+283FRYXAHSXgmj5tSgrWIDqNiFq8BMgJ9D7WWciDRDzFEgyWDxRXhImmW9JiyoQIAUQBQMOfiGxpqalYx0G6kR/rNbvdZjDo8TQr0w4zt66uHgvg0pKi5pZWZCaiONp1zof0sAjavK/jvr9W6UOtxz54PBQgVjZMZBLmj0bhgiLGGhcQxk5DmmXCZZOUs7K01hQ1xin8t3qdClamDosyg9HJs59UdTzz0bED9X3YY8I8QeAghcBUCsnTi9nyG2YWW9ffNk0jlwz1xgztF/oJExZn/zDwoZGgFfEXEuIZ8BQAozWxUuPJ5CYOvZg69Kt4f1ruGEmn5yFl4L9YMsaKyDp0lzjgzqxxWIHk/fP4czU4V/S3bU2PvF4X7jgwuP9vcOjHtAWEH62J3cYAROlEEwmUQkLPsilXlZiK7QalBCGYbIhiuoLMgY7Q1uqe421OvAZioLtBHWZNosLCIS6tSFJ+3eSc9PW3lduMyhG2lkRQADQ6PFSloAFiYhy1OKwiNPiKG1H5x/MMRQ2J8XTcxDITxMULX8WUs+UZ1phT7532+3wIIHhJ2Ze2Nv3u7YZgV7V7/99Cg93YYCHGAmGA/MNFOhb7B+mDGx8WqlouxQ8owZaWF2eZMNlirsbUTHw4BH8gFpP/sCJrjlB4aUlu2mM/LMtOVY0QUYLO4+Q3zkth4Wo2G2E7xuGAhnc6nVgQQR1jfsINTlDB2CdGauzCU+gTrLQwwZLWCAL0TGwBFRMjRDMGg07HILa+0B2giWyYllEFeIVFiz/yAjsC3iSXyy3arKgaXi+0JLa+Y3Hi/zSwE305hzkg/jpah7NH1y/LQlDqf25gKYUxWPVGoL0SGaDSIYRwG4hjMzY4BZiHEmKDkGBNf4hMzngMieegcYiSxDd8EFUBwWfkGtmkVVHr3EUl5kfWlaQjmuqUI55kO+NCYZ2d3RoNVDxxb+DC6WJ8QkEDmva2dkwAKBtqAQoKJ5ZxbBlAoxhofFQJpOCKwLIXyDocjqws4grFi4AbZeITJhA+VcQ9F4WSQQlkdRwIwtBCgfDuIQVmDx5h6YAHZrMZ5btwyM3j+boIQOvRA+w5XDrXBt/kI6/LD8lu4ax7/cc+Dru7Y4Y3xBCbVuTgDrwCQBdCFxNtAn0MJaJtiNTHvhFEoryAzRv7dDpvBWfIWLfYdscacqhxZPTREkiuyWQElHCEiZoXTgLSQhhXDAPjBOs+iCfOjaMujACrVY8GYP0lw44iQ7b4QTzWCJjJwFnMUxQVvQh4BFhxj08MAsCNYpEB6waMDNSlVMqRBxngfjh5kE3QYRKGFQtixELwysjX+aigoSVit9Ll45/bcuKVzzsH+vuE9n3+ll0RV9dJXU52OQAzwRxkiD5k8oV8w8qXnMVCMsOppKmFjH0+ZcjDjtJda3IXlZpHONY7tAG4B9AAAjfiZ/xprCKiuIekEKnAhUfxV0hrYpeYODS/mJMM0S/LIFljr5CM+I97XKKyJTenqsM9Bk2s4JE+vioBKBsSBNuxtnXwxW0tnxzB3+kbEByNke6qsKMp4hvAUT0oh3gHYm1FB6ByWIlMw2osrLlQME1mNdZCm/aahdZL51jP6YzVSJ37Z3h2AQgQuwlnA2Ct7/R8sL9rW1X/iW4c+HULvn7K20sFHNHAoMDjj3iQo0iUVEXLdJTSRCkRwKs36lTlOZo109MWlZq0Ko6EBZ0Son8GAL9qGy8YAWJDSGgNy3j9fF27++CJwaMt7ubewICH94fC0OaEAIaBcxQybtFz+RbV1GztlGydzaSAGoGL9BsFvYjYBSbgZKE4sYYBQdZjAk4c4pwCfgI8IQDpCJtBVJNKDtORRJfAWDzbCuurStc/w/tfCwFDOy7Ot+Tz5FRHpkH8fAOFfSgs8fvzWQfEXx7LDYE79m8smb+BeUb3Fn0DQRnPLicJGE+0E9SVJCABKOOZlCRgPNFOUFeSgASgjGdSkoDxRDtBXUkCEoAynklJAsYT7QR1JQlIAMp4JiUJGE+0E9SVJCABKOOZlCRgPNFOUFeSgASgjGdSkoDxRDtBXUkCEoAynklJAsYT7QR1JQlIAMp4JiUJGE+0E9SVJCABKOOZlCRgPNFOUFeSgASgjGdSkoDxRDtBXUkCEoAynklJAsYT7QR1JQlIAMp4JiUJGE+0E9SVJCABKOOZlCRgPNFOUFeSgASgjGdSkoDxRDtBXUkCEoAynklJAsYT7QR1JQlIAMp4Jv0/QCQAP3oxVP4AAAAASUVORK5CYII=';
const PT_CHANNELS = [
  { label: 'Cộng đồng Skool', url: 'https://www.skool.com/avanix-ai-1973/classroom', icon: 'cap' },
  { label: 'Website', url: 'https://pieofmind.work/', icon: 'globe' },
  { label: 'YouTube', url: 'https://www.youtube.com/@pieofmind08', icon: 'play' },
  { label: 'TikTok', url: 'https://www.tiktok.com/@pieofmind', icon: 'music' }
];
const DEFAULT_PEOPLE = 'People.md';

const FONT_DIR = '5.RESOURCE/pie-of-mind-design-system/fonts';
const FONTS = [
  ['PieInter', 'Inter-Regular.ttf', 400], ['PieInter', 'Inter-Medium.ttf', 500],
  ['PieInter', 'Inter-SemiBold.ttf', 600], ['PieInter', 'Inter-Bold.ttf', 700],
  ['PieMono', 'JetBrainsMono-Regular.ttf', 400], ['PieMono', 'JetBrainsMono-Medium.ttf', 500],
  ['PieMono', 'JetBrainsMono-SemiBold.ttf', 600], ['PieMono', 'JetBrainsMono-Bold.ttf', 700],
  ['PieMono', 'JetBrainsMono-ExtraBold.ttf', 800]
];

const TONE = {
  blue: '#2F6DB0', amber: '#C28A1E', green: '#2E8B6B', steel: '#4F7BA3',
  burgundy: '#9A3B3B', purple: '#8A63D4', pink: '#C85A8E', teal: '#2AA5A5',
  orange: '#C97A2B', ink: '#2A2F3A', claude: '#D97757'
};
const LANE_TONES = ['blue', 'amber', 'green', 'steel', 'purple', 'pink', 'teal', 'orange', 'burgundy', 'ink'];
const AVATAR_TONES = ['blue', 'amber', 'green', 'steel', 'purple', 'pink', 'teal', 'orange', 'burgundy'];
const OWNER_TONE = { 'Pie': 'blue', 'Nguyên': 'ink', 'Claude': 'claude' };

// ---------- i18n ----------
// VN là ngôn ngữ gốc/khoá. tr('chuỗi VN') trả bản EN nếu LANG='en' & có trong I18N_EN,
// ngược lại trả nguyên chuỗi VN → tiếng Việt khỏi maintain, chỉ nuôi 1 dict EN.
let LANG = 'vi';
function tr(s) { return (LANG === 'en' && I18N_EN[s] != null) ? I18N_EN[s] : s; }
const I18N_EN = {
  // views / nav
  'Tất cả': 'All', 'Ngày': 'Day', 'Tuần': 'Week', 'Tháng': 'Month', 'Khoảng': 'Range',
  'Bảng': 'Board', 'Danh sách': 'List', 'Lịch': 'Calendar', 'Thống kê': 'Stats',
  'Về hôm nay': 'Back to today', 'Hôm nay': 'Today', 'Xem trước': 'Preview',
  // board / card
  'Không có việc': 'No tasks', 'Chưa giao': 'Unassigned', 'Quá hạn': 'Overdue',
  'Thêm việc': 'Add task', 'Thêm lane': 'Add lane', 'Thu/mở': 'Collapse/expand',
  'Tuỳ chọn lane': 'Lane options', 'Bấm chọn · nhấp đúp để đổi tên': 'Click to select · double-click to rename',
  ' việc · ': ' tasks · ', ' quá hạn · ': ' overdue · ', ' hoàn thành': ' done', ' người': ' people',
  '(không tiêu đề)': '(untitled)', 'Việc mới': 'New task',
  // lane menu
  'Sửa tên lane': 'Rename lane', 'Chèn lane trước': 'Insert lane before', 'Chèn lane sau': 'Insert lane after',
  'Sắp xếp theo tên': 'Sort by name', 'Sắp xếp theo hạn': 'Sort by due date', 'Xoá lane': 'Delete lane',
  // drawer
  'Dự án': 'Project', 'Gắn vào dự án': 'Add to project', 'Gỡ khỏi dự án': 'Remove from project',
  'Thời gian': 'Time', 'Trạng thái': 'Status', 'Độ ưu tiên': 'Priority', 'Chuyển lane': 'Move lane',
  'Phụ trách': 'Assignee', 'Thêm người': 'Add person', 'Gỡ người này': 'Remove this person',
  'Việc kế tiếp · ': 'Next steps · ', 'Thêm bước': 'Add step', 'Xoá bước': 'Delete step',
  'Tài liệu · file liên quan': 'Docs · related files', 'Gắn note/file': 'Attach note/file', 'Gỡ liên kết': 'Remove link',
  'Mã việc 1Office': '1Office task ID', 'Chưa có ngày': 'No date',
  'Bắt đầu': 'Start', 'Kết thúc': 'End',
  // drawer actions
  'Đánh dấu xong': 'Mark done', 'Bỏ xong': 'Mark undone', 'Nhân bản': 'Duplicate',
  'Huỷ việc': 'Cancel task', 'Xoá việc': 'Delete task',
  // list / stats / calendar
  'Danh sách công việc': 'Task list', 'Không có việc khớp bộ lọc.': 'No tasks match the filter.',
  'Tất cả người': 'Everyone', 'Mọi trạng thái': 'All statuses',
  'Mọi lúc': 'Any time', 'Tuần này': 'This week', 'Tháng này': 'This month', 'Khoảng tùy chọn': 'Custom range',
  'Việc': 'Task', 'Lane': 'Lane', 'Người': 'People', 'Hạn': 'Due',
  'Lịch — ': 'Calendar — ', 'Tháng ': 'Month ', ' nữa': ' more',
  'Sắp tới & quá hạn': 'Upcoming & overdue', 'Không có dữ liệu': 'No data', 'Khối lượng theo người': 'Workload by person',
  // status labels (display only — file vẫn giữ VN)
  'Đang chờ': 'Pending', 'Đang thực hiện': 'In progress', 'Đang đánh giá': 'In review',
  'Hoàn thành': 'Done', 'Chưa hoàn thành': 'Not done', 'Không hoàn thành': 'Failed',
  'Tạm dừng': 'Paused', 'Hủy': 'Cancelled', 'Dự kiến': 'Expected', 'Đã đóng': 'Closed', 'Lỗi': 'Error',
  'Ưu tiên cao': 'High priority', 'Thường': 'Normal', 'Ưu tiên': 'Priority',
  // profiles / popover
  'Bảng của bạn': 'Your boards', 'Thêm bảng mới': 'Add board', 'Quản lý bảng': 'Manage boards',
  'Thêm bảng': 'Add board', '＋ Thêm bảng': '＋ Add board', 'Sửa bảng': 'Edit board',
  'Sửa': 'Edit', 'Xoá': 'Delete', 'Huỷ': 'Cancel', 'Lên': 'Up', 'Xuống': 'Down',
  'Bảng: ': 'Board: ', 'Mở ': 'Open ', ' · đang mở': ' · open',
  // lane / profile modal
  'Tên lane': 'Lane name', 'Sửa lane': 'Edit lane', 'Tự': 'Auto', 'Màu': 'Color',
  'Màu tự động theo vị trí lane': 'Auto color by lane position', 'Tự động theo tên lane': 'Auto by lane name',
  'Tên bảng': 'Board name', 'Biểu tượng (để trống = chữ cái đầu tên)': 'Icon (empty = first letter of name)',
  'Chữ cái đầu tên': 'First letter of name', ' Chọn ảnh từ vault…': ' Pick image from vault…',
  'Bỏ ảnh': 'Remove image', 'Màu nền': 'Background color', 'Chọn…': 'Select…',
  'File công việc (bắt buộc)': 'Task file (required)',
  'File nhân sự (tuỳ chọn — để trống dùng mặc định chung)': 'People file (optional — empty uses shared default)',
  // pickers
  'Gõ để tìm / thêm người phụ trách…': 'Type to search / add an assignee…',
  '➕ Thêm "': '+ Add "', 'Gõ để tìm note / file trong vault…': 'Type to search a note / file in the vault…',
  'Chọn dự án (note có subtype / type: project)…': 'Pick a project (note with subtype / type: project)…',
  // modals / notices
  'Không tìm thấy file': 'File not found', 'Chưa đọc được "': 'Could not read "',
  'Xác nhận': 'Confirm', 'Đồng ý': 'OK', 'Xoá bảng "': 'Delete board "',
  '"? File .md KHÔNG bị xoá, chỉ gỡ khỏi danh sách bảng.': '"? The .md file is NOT deleted, only removed from the board list.',
  'Phải còn ít nhất 1 bảng.': 'At least 1 board must remain.',
  'Hãy chọn file ảnh (png/jpg/webp/svg…).': 'Please choose an image file (png/jpg/webp/svg…).',
  // setup
  ' Thiết lập hệ thống quản lý công việc': ' Set up the task management system',
  'Dựng sẵn mọi thứ Pie Tasks cần. Chỉ tạo file còn thiếu — file đã có sẽ được giữ nguyên.': 'Sets up everything Pie Tasks needs. Only creates missing files — existing files are kept.',
  'Thư mục chứa dự án': 'Projects folder',
  'Nơi đặt Dashboard Projects.base + các note có "subtype: project".': 'Where Dashboard Projects.base + notes with "subtype: project" live.',
  'Thiết lập': 'Set up', 'Đang dựng…': 'Setting up…', 'Thiết lập nhanh': 'Quick setup', 'Thiết lập nhanh hệ thống': 'Quick system setup',
  'Dựng 1 lần: bảng công việc + file nhân sự + Dashboard dự án (Bases) + Dashboard việc con (Dataview). Chỉ tạo file còn thiếu.': 'One-shot: task board + people file + Projects dashboard (Bases) + child-task dashboard (Dataview). Only creates missing files.',
  // settings tab
  'Quản lý công việc từ file Markdown — bảng, danh sách, lịch, dashboard.': 'Manage tasks from Markdown files — board, list, calendar, dashboard.',
  'Cộng đồng Skool': 'Skool community',
  'Bảng công việc (profile)': 'Task board (profile)',
  'Mỗi bảng = 1 file .md riêng (quản lý theo project). Đổi bảng bằng chip góc trên-trái board.': 'Each board = its own .md file (manage per project). Switch boards via the chip at the top-left.',
  'Đường dẫn file bảng đang mở': 'Current board file path', 'File Markdown của bảng hiện tại "': 'Markdown file of the current board "',
  'File nhân sự mặc định (dùng chung)': 'Default people file (shared)',
  'File bảng nhân sự cho picker "Thêm người phụ trách" (dạng | Tên | ID | …). Bảng nào để trống peoplePath sẽ dùng file này.': 'People table file for the "Add assignee" picker (format | Name | ID | …). Boards with empty peoplePath use this file.',
  'Phạm vi bảng việc con theo dự án': 'Child-task board scope by project',
  'Dataview gom task con theo dự án trong note dashboard. "Tất cả" = mọi task gắn dự án trong vault (kể cả checklist thừa kế frontmatter). "Chỉ Pie Tasks" = chỉ task gắn dự án trực tiếp trên các bảng Pie.': 'Dataview groups child tasks by project in the dashboard note. "All" = every project-tagged task in the vault (incl. checklists inheriting frontmatter). "Pie Tasks only" = only tasks tagged directly on Pie boards.',
  'Đường dẫn note dashboard việc con': 'Child-task dashboard note path',
  'Note chứa 2 khối Dataview (vùng tự sinh giữa marker). Chưa có sẽ tự tạo khi lưu phạm vi.': 'Note with 2 Dataview blocks (auto-generated between markers). Created automatically when you save the scope.',
  'Ghi lại': 'Rewrite',
  'Hiện danh sách bước làm trên thẻ': 'Show step list on card',
  'Bật: thẻ việc hiện đầy đủ các bước (tick được ngay trên thẻ). Tắt: chỉ hiện số đếm dạng 0/3.': 'On: cards show all steps (tickable on the card). Off: only a count like 0/3.',
  // commands / ribbon
  'Pie Tasks (từ file)': 'Pie Tasks (from file)',
  'Mở Pie Tasks — dữ liệu thật từ file': 'Open Pie Tasks — real data from file',
  'Mở giao diện mẫu — Day Planner': 'Open demo — Day Planner', 'Mở giao diện mẫu — Studio': 'Open demo — Studio',
  'Tải lại TASKS.md': 'Reload TASKS.md', 'Tải lại': 'Reload',
  'Ngôn ngữ': 'Language', 'Ngôn ngữ hiển thị của plugin (dữ liệu trong file vẫn giữ nguyên).': 'Display language of the plugin (data in files stays unchanged).',
  'Ngày ': 'Day ', 'vd: Dự án Website': 'e.g. Website Project', 'vd: PROJECTS/task1.md': 'e.g. PROJECTS/task1.md', 'vd: People.md': 'e.g. People.md',
  'Bảng chính': 'Main board', 'Đã ghi dashboard việc con.': 'Child-task dashboard written.',
  'Pie Tasks: tạo ': 'Pie Tasks: created ', ' file': ' file(s)', ', giữ ': ', kept ', ' file đã có': ' existing file(s)',
};

// bộ trạng thái thật của 1Office (enum field `status`)
const STATES = {
  pending:  { lab: 'Đang chờ',        c: '#8A8F98' },
  doing:    { lab: 'Đang thực hiện',  c: '#2F6DB0' },
  review:   { lab: 'Đang đánh giá',   c: '#C85A8E' },
  completed:{ lab: 'Hoàn thành',      c: '#2E8B6B' },
  notdone:  { lab: 'Chưa hoàn thành', c: '#C9962B' },
  fail:     { lab: 'Không hoàn thành',c: '#B0563E' },
  pause:    { lab: 'Tạm dừng',        c: '#7D6CD0' },
  cancel:   { lab: 'Hủy',             c: '#9A3B3B' },
  expected: { lab: 'Dự kiến',         c: '#4F7BA3' },
  closed:   { lab: 'Đã đóng',         c: '#5B6472' },
  over:     { lab: 'Quá hạn',         c: '#C0392B' },
  open:     { lab: 'Chưa xử lý',      c: '#7D848F' },
  error:    { lab: 'Lỗi',             c: '#E5484D' }
};
const SETTABLE = ['pending', 'doing', 'review', 'completed', 'notdone', 'fail', 'error', 'pause', 'cancel', 'expected', 'closed'];
const FILTER_ORDER = ['doing', 'review', 'error', 'over', 'completed'];
const LABELS = {
  'Đang chờ': 'pending', 'Mới': 'pending',
  'Đang thực hiện': 'doing', 'Đang làm': 'doing',
  'Đang đánh giá': 'review', 'Chờ duyệt': 'review',
  'Hoàn thành': 'completed',
  'Chưa hoàn thành': 'notdone',
  'Không hoàn thành': 'fail',
  'Tạm dừng': 'pause',
  'Hủy': 'cancel', 'Huỷ': 'cancel',
  'Dự kiến': 'expected',
  'Đã đóng': 'closed', 'Đóng': 'closed',
  'Lỗi': 'error', 'Báo lỗi': 'error', 'Error': 'error', 'ERROR': 'error'
};
const STATUS_LABELS = Object.keys(LABELS).sort((a, b) => b.length - a.length);
const STATUS_RE = new RegExp('`(' + STATUS_LABELS.join('|') + ')`');
const STATUS_RE_STRIP = new RegExp('\\s*`(' + STATUS_LABELS.join('|') + ')`', 'g');

const PRI = { high: { lab: 'Cao', c: '#E5484D' }, med: { lab: 'Trung bình', c: '#E5A44D' }, normal: { lab: 'Bình thường', c: '#7D848F' }, low: { lab: 'Thấp', c: '#59606B' } };
const PRIO_ORDER = { high: 3, med: 2, normal: 1, low: 0 };
const EISEN = {
  q1: { lab: 'Quan trọng · Khẩn cấp', short: 'QT-KC', c: '#C0392B' },
  q2: { lab: 'Quan trọng · Không khẩn cấp', short: 'QT-KKC', c: '#2E8B6B' },
  q3: { lab: 'Không quan trọng · Khẩn cấp', short: 'KQT-KC', c: '#C9962B' },
  q4: { lab: 'Không quan trọng · Không khẩn cấp', short: 'KQT-KKC', c: '#7D848F' }
};
const VIEWS = [['all', 'Tất cả'], ['day', 'Ngày'], ['week', 'Tuần'], ['month', 'Tháng'], ['range', 'Khoảng']];

const I = {
  board: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="18" rx="1.5"/><rect x="14" y="3" width="7" height="11" rx="1.5"/></svg>',
  listNav: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>',
  calNav: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/></svg>',
  dash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 19V5M4 19h16M8 16l3.5-4 3 2.5L20 8"/></svg>',
  flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 21V4h11l-1.5 4L16 12H5"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2z"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M8 13h8M8 17h6"/></svg>',
  bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 4v4M3 13v2M21 13v2"/><circle cx="9.5" cy="13.5" r="1.15" fill="currentColor" stroke="none"/><circle cx="14.5" cy="13.5" r="1.15" fill="currentColor" stroke="none"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5M21 20a6 6 0 0 0-5-5.9"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l2.5 1.5"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6"/></svg>',
  open: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6 9 17l-5-5"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
  person: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  userPlus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0M18 8v6M21 11h-6"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4.5" width="18" height="15" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M4 17l4.5-4.5 3.5 3.5 3-3L20 16.5"/></svg>',
  zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9z"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 0 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3 15a2 2 0 0 1 0-4h.1A1.6 1.6 0 0 0 4.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 9 3h.1A2 2 0 0 1 11 1a2 2 0 0 1 2 2v.1A1.6 1.6 0 0 0 15 4.6a1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.6 1.6 0 0 0 21 9v.1a2 2 0 0 1 0 4z"/></svg>',
  chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m6 9 6 6 6-6"/></svg>',
  chevL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>',
  chevR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>',
  dots: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 13a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V19a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.1-2.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>',
  cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9l10-5 10 5-10 5-10-5z"/><path d="M6 11.5v4.5c0 1.5 3 3 6 3s6-1.5 6-3v-4.5"/><path d="M22 9v6"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15.3 15.3 0 0 1 0 18M12 3a15.3 15.3 0 0 0 0 18"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="2.5" y="5.5" width="19" height="13" rx="3.5"/><path d="M10.3 9.1v5.8l5.2-2.9z" fill="currentColor" stroke="none"/></svg>',
  music: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l9-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="15.5" cy="16" r="2.5"/></svg>'
};
const SI = {
  dot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>',
  pending: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  doing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z" fill="currentColor" stroke="none"/></svg>',
  review: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9 12h6M9 9h6M9 15h4"/></svg>',
  completed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><path d="M8 12l2.5 2.5L16 9"/></svg>',
  notdone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v8"/></svg>',
  fail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3 2 20h20z"/><path d="M12 9v5M12 17h.01"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/></svg>',
  cancel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></svg>',
  expected: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/></svg>',
  closed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
  over: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3 2 20h20z"/><path d="M12 9v5M12 17h.01"/></svg>',
  error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 3h6l6 6v6l-6 6H9l-6-6V9z"/><path d="M12 8v5M12 16h.01"/></svg>'
};

// ---------- helpers ----------
function iso(d) { const z = n => String(n).padStart(2, '0'); return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()); }
function today() { return iso(new Date()); }
function fmtDate(s) { const p = s.split('-'); return p[2] + '/' + p[1]; }
function fmtDateFull(s) { const p = s.split('-'); return p[2] + '.' + p[1] + '.' + p[0]; }
function initials(name) {
  const w = String(name).trim().split(/\s+/).filter(Boolean);
  if (w.length >= 2) return (w[w.length - 2][0] + w[w.length - 1][0]).toUpperCase();
  return String(name).slice(0, 2).toUpperCase();
}
function hashInt(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function ownerTone(name) { return OWNER_TONE[name] || AVATAR_TONES[hashInt(String(name)) % AVATAR_TONES.length]; }
function laneName(raw) { return raw.replace(/^[^\p{L}\p{N}]+/u, '').replace(/\s*\([^)]*\)\s*$/, '').trim(); }
function laneEmoji(raw) { const m = raw.match(/^\s*(\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic})*)/u); return m ? m[1] : ''; }
function laneHeading(emoji, name) { return emoji ? emoji + ' ' + name : name; }
// Bộ icon lane cho user chọn (mỗi icon 1 emoji canonical để lưu vào heading)
const LANE_ICONS = [
  { key: 'flag',   emoji: '📌', label: 'Ưu tiên' },
  { key: 'bot',    emoji: '🤖', label: 'Bot / AI' },
  { key: 'doc',    emoji: '📄', label: 'Tài liệu' },
  { key: 'list',   emoji: '📋', label: 'Danh sách' },
  { key: 'calNav', emoji: '📅', label: 'Lịch' },
  { key: 'clock',  emoji: '⏳', label: 'Chờ / hạn' },
  { key: 'check',  emoji: '✅', label: 'Hoàn thành' },
  { key: 'folder', emoji: '📁', label: 'Nhóm / kho' },
  { key: 'users',  emoji: '👥', label: 'Đội nhóm' },
  { key: 'dash',   emoji: '📊', label: 'Thống kê' },
  { key: 'board',  emoji: '🗂️', label: 'Bảng' },
  { key: 'link',   emoji: '🔗', label: 'Liên kết' }
];
const EMOJI_ICON = {};
LANE_ICONS.forEach(x => { EMOJI_ICON[x.emoji] = x.key; });
Object.assign(EMOJI_ICON, {
  '🚩': 'flag', '🏁': 'flag', '⭐': 'flag', '🔥': 'flag', '🎯': 'flag', '🤝': 'flag',
  '🧪': 'bot', '⚙️': 'bot', '🛠️': 'bot',
  '📃': 'doc', '📝': 'doc', '📢': 'doc', '📣': 'doc', '✍️': 'doc',
  '🗒️': 'list', '☑️': 'check', '✔️': 'check',
  '🗓️': 'calNav', '⏰': 'clock', '⌛': 'clock',
  '📦': 'folder', '🗄️': 'folder',
  '👤': 'users', '🧑': 'users',
  '📈': 'dash', '📉': 'dash'
});
const LANE_COLORS = LANE_TONES.map(t => TONE[t]);
function laneIcon(raw) {
  const em = laneEmoji(raw);
  if (em && EMOJI_ICON[em]) return EMOJI_ICON[em];
  const n = laneName(raw).toLowerCase();
  if (/🤖|ai agent|đội ngũ/.test(n)) return 'bot';
  if (/marketing|content/.test(n)) return 'doc';
  if (/bán hàng|sale/.test(n)) return 'flag';
  if (/r&d|kỹ thuật/.test(n)) return 'bot';
  if (/completed|hoàn|xong/.test(n)) return 'check';
  if (/scheduled|lịch/.test(n)) return 'calNav';
  if (/active|nguyên/.test(n)) return 'flag';
  if (/chưa gắn|khác/.test(n)) return 'folder';
  return 'list';
}
function cardIcon(t) {
  if (/chatbot|botcake|meta|workflow|automation|n8n/i.test(t.title)) return 'bot';
  if (/báo cáo|tài liệu|content|ảnh|video|sổ sách|kế toán/i.test(t.title)) return 'doc';
  return t.laneIcon || 'list';
}
function isSyncedLane(name) { return /\(\s*\d+\s*active/i.test(name); }
function dOnly(s) { return new Date(s + 'T00:00:00'); }
function weekRange(a) { const d = dOnly(a); const wd = (d.getDay() + 6) % 7; const mon = new Date(d); mon.setDate(d.getDate() - wd); const sun = new Date(mon); sun.setDate(mon.getDate() + 6); return [iso(mon), iso(sun)]; }
function monthRange(a) { const p = a.split('-'); const last = new Date(+p[0], +p[1], 0).getDate(); return [p[0] + '-' + p[1] + '-01', p[0] + '-' + p[1] + '-' + String(last).padStart(2, '0')]; }
function activeRange(viewMode, anchor, rs, re) {
  if (viewMode === 'day') return [anchor, anchor];
  if (viewMode === 'week') return weekRange(anchor);
  if (viewMode === 'month') return monthRange(anchor);
  if (viewMode === 'range') return [rs, re];
  return null; // all
}

// ---------- parser ----------
function parseTasks(md, path) {
  const lines = md.split('\n');
  const tod = today();
  let lane = null, cur = null;
  const lanes = [];
  const tasks = [];
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const h = raw.match(/^##\s+(.*)$/);
    if (h) {
      lane = h[1].trim(); cur = null;
      if (!SKIP_SECTIONS.some(s => lane.indexOf(s) !== -1) && lanes.indexOf(lane) === -1) lanes.push(lane);
      continue;
    }
    if (lane == null || SKIP_SECTIONS.some(s => lane.indexOf(s) !== -1)) continue;
    const top = raw.match(/^- \[( |x|X)\]\s+(.*)$/);
    const sub = raw.match(/^[ \t]+- \[( |x|X)\]\s+(.*)$/);
    if (sub && cur) {
      cur.check.push([sub[2].replace(/`[^`]*`/g, '').trim(), sub[1].toLowerCase() === 'x', parseOwners(sub[2])[0] || null]);
      cur.blockEnd = i;
      continue;
    }
    if (!top) continue;
    const rest = top[2];
    const done = top[1].toLowerCase() === 'x';
    const owners = parseOwners(rest);
    const owner = owners.length ? owners.map(o => o.name).join(', ') : null;
    let date = null;
    const dm = rest.match(/📅\s*(\d{4}-\d{2}-\d{2})/);
    if (dm) date = dm[1];
    else { const dd = rest.match(/deadline:\s*(\d{2})\/(\d{2})\/(\d{4})/); if (dd) date = dd[3] + '-' + dd[2] + '-' + dd[1]; }
    let startDate = null;
    const sdm = rest.match(/🛫\s*(\d{4}-\d{2}-\d{2})/);
    if (sdm) startDate = sdm[1];
    let s = null, e = null;
    const tm = rest.match(/⏰\s*(\d{1,2}:\d{2})\s*(?:[–\-—→]|to)\s*(\d{1,2}:\d{2})/);
    if (tm) { s = tm[1]; e = tm[2]; }
    let status = 'open';
    const sm = rest.match(STATUS_RE);
    if (sm) status = LABELS[sm[1]] || 'open';
    if (done) status = 'completed';
    const over = !done && (/⚠️/.test(rest) || (date && date < tod));
    const idm = rest.match(/id:(\d+)/);
    const prio = derivePrio(rest);
    const pri = prio === 'high';
    const pctm = rest.match(/`(\d{1,3})%`/);
    const nextm = rest.match(/`next:\s*([^`]+)`/);
    const notem = rest.match(/`note:\s*([^`]+)`/);
    const eim = rest.match(/`eisen:\s*(q[1-4])`/);
    const outm = rest.match(/`output:\s*([^`]+)`/);
    const outputs = outm ? (outm[1].match(/\[\[[^\]]+\]\]/g) || []) : [];
    const projm = rest.match(/\[project::\s*(\[\[[^\]]+\]\])\s*\]/) || rest.match(/`project:\s*(\[\[[^\]]+\]\])`/);
    const project = projm ? projm[1] : null;
    let title = rest
      .replace(/\[project::\s*\[\[[^\]]+\]\]\s*\]/g, '')
      .replace(/`[^`]*`/g, '').replace(/✅\s*\d{4}-\d{2}-\d{2}/g, '').replace(/📅\s*\d{4}-\d{2}-\d{2}/g, '').replace(/🛫\s*\d{4}-\d{2}-\d{2}/g, '')
      .replace(/⚠️\s*QUÁ HẠN/gi, '').replace(/[🔴🟡🟢🔽🤖👤🛫⚠️📌📅🔗📊🔥⏰]/g, '').replace(/\*\*/g, '')
      .replace(/\s{2,}/g, ' ').trim();
    if (!title) title = '(không tiêu đề)';
    cur = {
      lane, laneName: laneName(lane), title, done, owner, owners, date, startDate, s, e, status, over, pri, prio,
      id: idm ? idm[1] : null, pct: pctm ? +pctm[1] : null, next: nextm ? nextm[1].trim() : null, note: notem ? notem[1].trim() : null, eisen: eim ? eim[1] : null, outputs, project,
      check: [], raw, line: i, blockStart: i, blockEnd: i, laneIcon: laneIcon(lane), synced: isSyncedLane(lane)
    };
    tasks.push(cur);
  }
  return { lanes, tasks, path };
}
function taskKey(t) { return t.id ? 'id:' + t.id : (t.lane + '::' + t.title + '::' + t.line); }
function findTask(tasks, key) { return tasks.find(t => taskKey(t) === key) || null; }

// ---------- section helpers (on a lines array) ----------
function laneRanges(lines) {
  const r = [];
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^##\s+(.*)$/);
    if (h) r.push({ raw: h[1].trim(), name: laneName(h[1].trim()), head: i, bodyStart: i + 1, bodyEnd: lines.length - 1 });
  }
  for (let k = 0; k < r.length; k++) if (k + 1 < r.length) r[k].bodyEnd = r[k + 1].head - 1;
  // cap section cuối trước trailer '%% kanban:settings %%' (không cho insert lọt ra sau nó)
  const sIdx = lines.findIndex(l => l.indexOf('kanban:settings') !== -1);
  if (sIdx !== -1 && r.length) { const last = r[r.length - 1]; if (last.bodyEnd >= sIdx) last.bodyEnd = sIdx - 1; }
  return r;
}
function findLane(lines, name) { return laneRanges(lines).find(l => l.name === name || l.raw === name) || null; }
function insertPos(lines, rng) {
  // index to insert a new block: after last non-blank line in body, else right after heading
  for (let i = rng.bodyEnd; i >= rng.bodyStart; i--) if (lines[i] && lines[i].trim() !== '') return i + 1;
  return rng.head + 1;
}
// task-blocks inside a section: [{start,end,lines:[]}]
function taskBlocks(lines, rng) {
  const blocks = [];
  let cur = null;
  for (let i = rng.bodyStart; i <= rng.bodyEnd && i < lines.length; i++) {
    const l = lines[i];
    if (/^- \[[ xX]\]/.test(l)) { cur = { start: i, end: i }; blocks.push(cur); }
    else if (cur && /^[ \t]+- \[[ xX]\]/.test(l)) cur.end = i;
    else if (cur && l.trim() === '') { /* keep, could be trailing */ }
    else cur = null;
  }
  return blocks;
}
function blockRangeOf(lines, task) {
  // recompute block for a task line index: task.line, extend over indented sub-lines
  const start = task.line;
  let end = start;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^[ \t]+- \[[ xX]\]/.test(lines[i])) end = i; else break;
  }
  return { start, end };
}

// ---------- single-line token editors (pure) ----------
function setTitleRaw(raw, title) { return raw.replace(/\*\*[\s\S]*?\*\*/, '**' + title + '**'); }
function setDateRaw(raw, isoDate) {
  if (!isoDate) return raw.replace(/\s*📅\s*\d{4}-\d{2}-\d{2}/, '');
  if (/📅\s*\d{4}-\d{2}-\d{2}/.test(raw)) return raw.replace(/📅\s*\d{4}-\d{2}-\d{2}/, '📅 ' + isoDate);
  return raw.replace(/(\*\*[\s\S]*?\*\*)/, '$1 📅 ' + isoDate);
}
function setStartDateRaw(raw, isoDate) {
  if (!isoDate) return raw.replace(/\s*🛫\s*\d{4}-\d{2}-\d{2}/, '');
  if (/🛫\s*\d{4}-\d{2}-\d{2}/.test(raw)) return raw.replace(/🛫\s*\d{4}-\d{2}-\d{2}/, '🛫 ' + isoDate);
  return raw.replace(/(\*\*[\s\S]*?\*\*)/, '$1 🛫 ' + isoDate);
}
function setTimeRaw(raw, s, e) {
  if (!s || !e) return raw.replace(/\s*`⏰[^`]*`/, '');
  const chip = '`⏰ ' + s + '–' + e + '`';
  if (/`⏰[^`]*`/.test(raw)) return raw.replace(/`⏰[^`]*`/, chip);
  return raw.replace(/\s*$/, '') + ' ' + chip;
}
function setNoteRaw(raw, text) {
  const t = (text || '').replace(/`/g, '').trim();
  if (!t) return raw.replace(/\s*`note:[^`]*`/, '');
  const chip = '`note: ' + t + '`';
  if (/`note:[^`]*`/.test(raw)) return raw.replace(/`note:[^`]*`/, chip);
  return raw.replace(/\s*$/, '') + ' ' + chip;
}
function setEisenRaw(raw, code) {
  if (!code) return raw.replace(/\s*`eisen:[^`]*`/, '');
  const chip = '`eisen: ' + code + '`';
  if (/`eisen:[^`]*`/.test(raw)) return raw.replace(/`eisen:[^`]*`/, chip);
  return raw.replace(/\s*$/, '') + ' ' + chip;
}
// Priority 3 mức: high=🔴 (Cao), low=🔽 (Thấp), mid=không marker (mặc định).
// Ưu tiên emoji (do UI set) > token `priority: x` (taxonomy import) > `Ưu tiên` legacy (chỉ trong backtick) > mid.
function derivePrio(rest) {
  if (/🔴/.test(rest)) return 'high';
  if (/🟡/.test(rest)) return 'med';
  if (/🔽/.test(rest)) return 'low';
  const pm = rest.match(/priority:\s*(urgent|high|medium|low)/i);
  if (pm) { const v = pm[1].toLowerCase(); return (v === 'urgent' || v === 'high') ? 'high' : (v === 'medium' ? 'med' : (v === 'low' ? 'low' : 'normal')); }
  if (/`[^`]*Ưu tiên[^`]*`/.test(rest)) return 'high';
  return 'normal';
}
function setPrioRaw(raw, level) {
  const s = raw.replace(/\s*🔴/g, '').replace(/\s*🟡/g, '').replace(/\s*🔽/g, '').replace(/\s*`?\s*priority:\s*(?:urgent|high|medium|low)\s*`?/gi, '');
  if (level === 'high') return s.replace(/(\*\*[\s\S]*?\*\*)/, '$1 🔴');
  if (level === 'med') return s.replace(/(\*\*[\s\S]*?\*\*)/, '$1 🟡');
  if (level === 'low') return s.replace(/(\*\*[\s\S]*?\*\*)/, '$1 🔽');
  return s;
}
// Owner model: mỗi người là 1 chip riêng `👤 Tên` (người) / `🤖 Tên` (AI).
function parseOwners(rest) {
  const out = [], re = /`\s*(👤|🤖)\s*([^`]+?)\s*`/g; let m;
  while ((m = re.exec(rest))) { const nm = m[2].trim(); if (nm && nm !== '—') out.push({ name: nm, kind: m[1] === '🤖' ? 'ai' : 'human' }); }
  if (!out.length) { const lm = rest.match(/`owner:\s*([^`]+)`/); if (lm) { const nm = lm[1].trim(); if (nm && nm !== '—') out.push({ name: nm, kind: 'human' }); } }
  return out;
}
// Bóc sạch mọi mảnh owner (chip 👤/🤖 chuẩn, owner: cũ, và mảnh bare không backtick) — diệt lồng đúp.
function stripOwnersRaw(raw) {
  let s = raw, prev;
  do { prev = s; s = s.replace(/\s*`\s*(?:👤|🤖)\s*[^`]*`/, ''); } while (s !== prev);
  s = s.replace(/\s*`owner:[^`]*`/g, '');
  s = s.replace(/\s*(?:👤|🤖)[^`]*/g, '');
  return s.replace(/``+/g, '').replace(/(\S)[ \t]{2,}/g, '$1 ').replace(/[ \t]+$/, '');
}
function setOwnersRaw(raw, owners) {
  const clean = stripOwnersRaw(raw);
  if (!owners || !owners.length) return clean;
  const chips = owners.map(o => '`' + (o.kind === 'ai' ? '🤖' : '👤') + ' ' + o.name + '`').join(' ');
  if (/\*\*[\s\S]*?\*\*/.test(clean)) return clean.replace(/(\*\*[\s\S]*?\*\*)/, '$1 ' + chips);
  return clean.replace(/[ \t]+$/, '') + ' ' + chips;
}
// Đọc danh bạ: tự nhận dạng bảng token (cột 1 = `👤 Tên`/`🤖 Tên`) hoặc bảng phẳng | Tên | ID |.
function parsePeopleTable(md) {
  const rows = [];
  md.split('\n').forEach(line => {
    const m = line.match(/^\|([^|]+)\|([^|]*)\|/);
    if (!m) return;
    const c1 = m[1].trim();
    const tok = c1.match(/^`?\s*(👤|🤖)\s*(.+?)\s*`?$/);
    if (tok) { const nm = tok[2].trim(); if (nm) rows.push({ name: nm, kind: tok[1] === '🤖' ? 'ai' : 'human', id: null }); return; }
    rows.push({ _plain: true, name: c1, id: /^\d+$/.test(m[2].trim()) ? m[2].trim() : null });
  });
  const rich = rows.filter(r => !r._plain);
  if (rich.length) return rich;
  return rows.filter(r => r.name && r.name !== 'Tên' && !/^:?-+:?$/.test(r.name)).map(r => ({ name: r.name, id: r.id, kind: 'human' }));
}
// ---------- Tiến độ (v1, derived-live) ----------
function daysBetween(a, b) { return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000); }
// Thực tế: done→100 · có % tự nhập→pct · else đầu việc done/total · else null
function actualProgress(t) {
  if (t.done) return 100;
  if (t.pct != null) return Math.max(0, Math.min(100, t.pct));
  if (t.check && t.check.length) return Math.round(t.check.filter(x => x[1]).length / t.check.length * 100);
  return null;
}
// Dự kiến theo thời gian: cần đủ 🛫 start + 📅 end
function expectedProgress(t, todayISO) {
  if (!t.startDate || !t.date) return null;
  if (todayISO <= t.startDate) return 0;
  if (todayISO >= t.date) return 100;
  const total = daysBetween(t.startDate, t.date);
  if (total <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round(daysBetween(t.startDate, todayISO) / total * 100)));
}
// Gộp: {actual, expected, diff, kind, color}; null nếu task không có tiến độ
function progressInfo(t, todayISO) {
  const actual = actualProgress(t);
  if (actual == null) return null;
  if (t.done) return { actual: 100, expected: null, diff: null, kind: 'done', color: STATES.completed.c };
  const expected = expectedProgress(t, todayISO);
  if (expected == null) return { actual, expected: null, diff: null, kind: 'plain', color: '#5B93D6' };
  const diff = actual - expected;
  const kind = diff >= 0 ? 'ontrack' : (diff >= -15 ? 'warn' : 'late');
  const color = kind === 'ontrack' ? STATES.completed.c : (kind === 'warn' ? '#E5A44D' : '#E5484D');
  return { actual, expected, diff, kind, color };
}
function setPctRaw(raw, pct) {
  if (pct == null || pct === '') return raw.replace(/\s*`\d{1,3}%`/, '');
  const n = Math.max(0, Math.min(100, Math.round(+pct)));
  const chip = '`' + n + '%`';
  if (/`\d{1,3}%`/.test(raw)) return raw.replace(/`\d{1,3}%`/, chip);
  return raw.replace(/\s*$/, '') + ' ' + chip;
}
function setOutputRaw(raw, links) {
  if (!links || !links.length) return raw.replace(/\s*`output:[^`]*`/, '');
  const chip = '`output: ' + links.map(l => '[[' + l + ']]').join(', ') + '`';
  if (/`output:[^`]*`/.test(raw)) return raw.replace(/`output:[^`]*`/, chip);
  return raw.replace(/\s+$/, '') + ' ' + chip;
}
function setProjectRaw(raw, link) {
  // gỡ mọi dạng token cũ (code-span) lẫn mới (Dataview inline-field)
  const stripped = raw.replace(/\s*\[project::\s*\[\[[^\]]+\]\]\s*\]/, '').replace(/\s*`project:[^`]*`/, '');
  if (!link) return stripped;
  return stripped.replace(/\s+$/, '') + ' [project:: [[' + link + ']]]';
}
function setStatusRaw(raw, key) {
  const label = STATES[key] ? STATES[key].lab : null;
  let line = raw.replace(STATUS_RE_STRIP, '');
  const tod = today();
  if (key === 'completed') {
    line = line.replace(/- \[.\]/, '- [x]');
    if (!/✅\s*\d{4}-\d{2}-\d{2}/.test(line)) line = line + ' ✅ ' + tod;
  } else {
    line = line.replace(/- \[[xX]\]/, '- [ ]').replace(/\s*✅\s*\d{4}-\d{2}-\d{2}/, '');
    if (label) line = line.replace(/\s+$/, '') + ' `' + label + '`';
  }
  return line;
}
function toggleDoneRaw(raw) {
  let line = raw;
  if (/- \[ \]/.test(line)) line = line.replace('- [ ]', '- [x]'); else line = line.replace(/- \[[xX]\]/, '- [ ]');
  const tod = today();
  if (/- \[x\]/.test(line) && !/✅\s*\d{4}-\d{2}-\d{2}/.test(line)) line = line + ' ✅ ' + tod;
  if (/- \[ \]/.test(line)) line = line.replace(/\s*✅\s*\d{4}-\d{2}-\d{2}/, '');
  return line;
}

// ---------- block / section mutations (pure: md -> md) ----------
function editLineMd(md, key, fn) {
  const { tasks } = parseTasks(md, '');
  const t = findTask(tasks, key);
  if (!t) return md;
  const lines = md.split('\n');
  const nl = fn(lines[t.line], t);
  if (nl == null || nl === lines[t.line]) return md;
  lines[t.line] = nl;
  return lines.join('\n');
}
function deleteTaskMd(md, key) {
  const { tasks } = parseTasks(md, '');
  const t = findTask(tasks, key);
  if (!t) return md;
  const lines = md.split('\n');
  const b = blockRangeOf(lines, t);
  lines.splice(b.start, b.end - b.start + 1);
  return lines.join('\n');
}
function duplicateTaskMd(md, key) {
  const { tasks } = parseTasks(md, '');
  const t = findTask(tasks, key);
  if (!t) return md;
  const lines = md.split('\n');
  const b = blockRangeOf(lines, t);
  const block = lines.slice(b.start, b.end + 1).map((l, i) => {
    if (i === 0) {
      let nl = l.replace(/\s*`id:\d+`/, '').replace(/\s*✅\s*\d{4}-\d{2}-\d{2}/, '');
      nl = setTitleRaw(nl, t.title + ' (bản sao)');
      if (/- \[[xX]\]/.test(nl)) nl = nl.replace(/- \[[xX]\]/, '- [ ]');
      return nl;
    }
    return l.replace(/- \[[xX]\]/, '- [ ]');
  });
  lines.splice(b.end + 1, 0, ...block);
  return lines.join('\n');
}
function addTaskMd(md, laneNm, opts) {
  const lines = md.split('\n');
  const rng = findLane(lines, laneNm);
  if (!rng) return md;
  const o = opts || {};
  let line = '- [ ] **' + (o.title || 'Việc mới') + '**';
  if (o.date) line += ' 📅 ' + o.date;
  if (o.s && o.e) line += ' `⏰ ' + o.s + '–' + o.e + '`';
  const at = insertPos(lines, rng);
  lines.splice(at, 0, line);
  return lines.join('\n');
}
function moveTaskMd(md, key, targetLaneNm) {
  const { tasks } = parseTasks(md, '');
  const t = findTask(tasks, key);
  if (!t || t.laneName === targetLaneNm) return md;
  let lines = md.split('\n');
  const b = blockRangeOf(lines, t);
  const block = lines.slice(b.start, b.end + 1);
  lines.splice(b.start, b.end - b.start + 1);
  const rng = findLane(lines, targetLaneNm);
  if (!rng) return md;
  const at = insertPos(lines, rng);
  lines.splice(at, 0, ...block);
  return lines.join('\n');
}
function moveTaskToPosMd(md, key, targetLaneNm, beforeKey) {
  // Di chuyển task tới vị trí cụ thể trong lane (kéo đổi thứ tự). beforeKey=null → cuối lane.
  if (beforeKey === key) return md;
  const { tasks } = parseTasks(md, '');
  const t = findTask(tasks, key);
  if (!t) return md;
  const lines = md.split('\n');
  const b = blockRangeOf(lines, t);
  const blockLen = b.end - b.start + 1;
  const block = lines.slice(b.start, b.end + 1);
  // vị trí chèn tính trên lines GỐC (trước khi cắt) để index chính xác
  let insertAt;
  const bt = beforeKey ? findTask(tasks, beforeKey) : null;
  if (bt && bt.laneName === targetLaneNm) {
    insertAt = blockRangeOf(lines, bt).start;
  } else {
    const rng = findLane(lines, targetLaneNm);
    if (!rng) return md;
    insertAt = insertPos(lines, rng);
  }
  lines.splice(b.start, blockLen);            // cắt block bị kéo
  if (b.start < insertAt) insertAt -= blockLen; // block ở trên đích → dời index lên
  lines.splice(insertAt, 0, ...block);
  return lines.join('\n');
}
function toggleCheckMd(md, key, idx) {
  const { tasks } = parseTasks(md, '');
  const t = findTask(tasks, key);
  if (!t) return md;
  const lines = md.split('\n');
  const b = blockRangeOf(lines, t);
  let n = -1;
  for (let i = b.start + 1; i <= b.end; i++) {
    if (/^[ \t]+- \[[ xX]\]/.test(lines[i])) {
      n++;
      if (n === idx) { lines[i] = /- \[ \]/.test(lines[i]) ? lines[i].replace('- [ ]', '- [x]') : lines[i].replace(/- \[[xX]\]/, '- [ ]'); break; }
    }
  }
  return lines.join('\n');
}
function addStepMd(md, key, text) {
  const { tasks } = parseTasks(md, '');
  const t = findTask(tasks, key);
  if (!t || !text) return md;
  const lines = md.split('\n');
  const b = blockRangeOf(lines, t);
  lines.splice(b.end + 1, 0, '    - [ ] ' + text);
  return lines.join('\n');
}
function deleteStepMd(md, key, idx) {
  const { tasks } = parseTasks(md, '');
  const t = findTask(tasks, key);
  if (!t) return md;
  const lines = md.split('\n');
  const b = blockRangeOf(lines, t);
  let n = -1;
  for (let i = b.start + 1; i <= b.end; i++) {
    if (/^[ \t]+- \[[ xX]\]/.test(lines[i])) { n++; if (n === idx) { lines.splice(i, 1); break; } }
  }
  return lines.join('\n');
}
function editStepMd(md, key, idx, text) {
  const { tasks } = parseTasks(md, '');
  const t = findTask(tasks, key);
  if (!t || !text) return md;
  const lines = md.split('\n');
  const b = blockRangeOf(lines, t);
  let n = -1;
  for (let i = b.start + 1; i <= b.end; i++) {
    if (/^[ \t]+- \[[ xX]\]/.test(lines[i])) {
      n++;
      if (n === idx) { const pre = lines[i].match(/^([ \t]+- \[[ xX]\]\s+)/)[1]; const own = parseOwners(lines[i])[0] || null; lines[i] = setOwnersRaw(pre + text, own ? [own] : []); break; }
    }
  }
  return lines.join('\n');
}
function setStepOwnerMd(md, key, idx, owner) {
  const { tasks } = parseTasks(md, '');
  const t = findTask(tasks, key);
  if (!t) return md;
  const lines = md.split('\n');
  const b = blockRangeOf(lines, t);
  let n = -1;
  for (let i = b.start + 1; i <= b.end; i++) {
    if (/^[ \t]+- \[[ xX]\]/.test(lines[i])) { n++; if (n === idx) { lines[i] = setOwnersRaw(lines[i], owner ? [owner] : []); break; } }
  }
  return lines.join('\n');
}
function renameLaneMd(md, oldName, newName) {
  const lines = md.split('\n');
  const rng = findLane(lines, oldName);
  if (!rng || !newName) return md;
  lines[rng.head] = '## ' + newName;
  return lines.join('\n');
}
function addLaneMd(md, name, beforeName, after) {
  if (!name) return md;
  const lines = md.split('\n');
  if (beforeName) {
    const rng = findLane(lines, beforeName);
    if (rng) { const at = after ? rng.bodyEnd + 1 : rng.head; lines.splice(at, 0, '## ' + name, ''); return lines.join('\n'); }
  }
  // default: before "Completed" heading, else before kanban settings, else EOF
  const ranges = laneRanges(lines);
  const comp = ranges.find(l => /completed|hoàn|xong/i.test(l.name));
  let at = lines.length;
  if (comp) at = comp.head;
  else { const s = lines.findIndex(l => l.indexOf('%% kanban:settings') !== -1); if (s !== -1) at = s; }
  lines.splice(at, 0, '## ' + name, '', '');
  return lines.join('\n');
}
function deleteLaneMd(md, name) {
  const lines = md.split('\n');
  const ranges = laneRanges(lines);
  const idx = ranges.findIndex(l => l.name === name || l.raw === name);
  if (idx === -1) return md;
  const rng = ranges[idx];
  const blocks = taskBlocks(lines, rng);
  const moved = [];
  blocks.forEach(b => moved.push(...lines.slice(b.start, b.end + 1)));
  const neighbor = ranges[idx + 1] || ranges[idx - 1];
  // remove heading..bodyEnd
  lines.splice(rng.head, rng.bodyEnd - rng.head + 1);
  if (neighbor && moved.length) {
    const nlines = lines; const nrng = findLane(nlines, neighbor.name);
    if (nrng) { const at = insertPos(nlines, nrng); nlines.splice(at, 0, ...moved); }
  }
  return lines.join('\n');
}
function moveLaneMd(md, name, targetName, before) {
  if (name === targetName) return md;
  const lines = md.split('\n');
  const src = findLane(lines, name);
  if (!src) return md;
  const block = lines.slice(src.head, src.bodyEnd + 1);
  lines.splice(src.head, src.bodyEnd - src.head + 1);
  const tgt = findLane(lines, targetName);
  if (!tgt) { lines.splice(src.head, 0, ...block); return lines.join('\n'); }
  const at = before ? tgt.head : tgt.bodyEnd + 1;
  lines.splice(at, 0, ...block);
  return lines.join('\n');
}
function sortLaneMd(md, name, mode) {
  const lines = md.split('\n');
  const rng = findLane(lines, name);
  if (!rng) return md;
  const blocks = taskBlocks(lines, rng);
  if (blocks.length < 2) return md;
  const { tasks } = parseTasks(md, '');
  const info = blocks.map(b => {
    const t = tasks.find(x => x.line === b.start);
    return { block: lines.slice(b.start, b.end + 1), title: t ? t.title : '', date: t && t.date ? t.date : '9999-99-99' };
  });
  info.sort((a, b) => mode === 'text' ? a.title.localeCompare(b.title, 'vi') : a.date.localeCompare(b.date));
  const first = blocks[0].start, last = blocks[blocks.length - 1].end;
  const flat = []; info.forEach(x => flat.push(...x.block));
  lines.splice(first, last - first + 1, ...flat);
  return lines.join('\n');
}

// ---------- avatar helper ----------
function avEl(parent, name, cls) {
  const a = parent.createEl('span', { cls: 'av' + (cls ? ' ' + cls : '') });
  a.style.background = TONE[ownerTone(name)];
  a.setText(initials(name));
  return a;
}
function ownersOf(t) { return t.owner ? t.owner.split(',').map(x => x.trim()).filter(Boolean) : []; }

// ---------- live board view ----------
class PieLiveView extends obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    const vs = (plugin.prof && plugin.prof().viewState) || {};
    this.view = vs.view || 'board';
    this.viewMode = vs.viewMode || 'all';
    this.collapsed = new Set(vs.collapsed || []);
    this.filter = 'all';
    this.anchor = today();
    this.rangeStart = today(); this.rangeEnd = today();
    this.fltOwner = 'all'; this.fltPeriod = 'all'; this.fltStatus = 'all'; this.fltFrom = ''; this.fltTo = ''; this.fltLate = false;
    this.calAnchor = today().slice(0, 7) + '-01';
    this.selId = null;
  }
  getViewType() { return LIVE_VIEW; }
  getDisplayText() { return 'Pie Tasks'; }
  getIcon() { return 'checkmark'; }
  async onOpen() { if (!this.plugin.taskData) { try { await this.plugin.loadTasks(); } catch (e) {} } this.render(); }
  async onClose() {}

  persist() {
    this.plugin.prof().viewState = { view: this.view, viewMode: this.viewMode, collapsed: [...this.collapsed] };
    this.plugin.saveSettings();
  }
  theme() { return document.body.classList.contains('theme-dark') ? 'dark' : 'light'; }

  matchState(t) {
    if (this.filter === 'all') return true;
    if (this.filter === 'over') return t.over;
    if (this.filter === 'completed') return t.done || t.status === 'completed';
    return t.status === this.filter && !t.over && !t.done;
  }
  matchDate(t) { if (this.viewMode === 'all') return true; if (!t.date) return true; const r = activeRange(this.viewMode, this.anchor, this.rangeStart, this.rangeEnd); return !r || (t.date >= r[0] && t.date <= r[1]); }
  cardState(t) { return t.done ? 'completed' : (t.status === 'error' ? 'error' : (t.over ? 'over' : (t.status === 'open' ? 'open' : t.status))); }
  activeStatus(t) { return t.done ? 'completed' : (t.status && t.status !== 'open' ? t.status : null); }
  visible(t) { return this.matchState(t) && this.matchDate(t); }
  allTasks() { return (this.plugin.taskData && this.plugin.taskData.tasks) || []; }

  render() {
    const c = this.containerEl.children[1];
    c.empty();
    c.removeClass('pie-live-root');
    c.addClass('pie-board-root');
    c.removeClass('dw-open'); // reset: openCard sẽ thêm lại nếu có card được mở
    c.setAttribute('data-theme', this.theme());
    this.root = c;
    if (!this.plugin.taskData) {
      const rail = this.renderRail(c);
      const main = c.createEl('div', { cls: 'pb-main' });
      const head = main.createEl('div', { cls: 'pb-head' });
      const hl = head.createEl('div', { cls: 'pb-head-l' });
      hl.createEl('div', { cls: 'pb-title', text: 'Pie Tasks' });
      hl.createEl('div', { cls: 'pb-sub', text: tr('Không tìm thấy file') });
      main.createEl('div', { cls: 'pb-empty', text: tr('Chưa đọc được "') + this.plugin.prof().taskPath + '". Chỉnh đường dẫn ở bảng (chip góc trên) hoặc Settings → Pie Tasks.' });
      return;
    }
    this.renderRail(c);
    const main = c.createEl('div', { cls: 'pb-main' });
    this.renderHeaderBar(main);
    if (this.view === 'board') this.renderBoard(main);
    else if (this.view === 'list') this.renderList(main);
    else if (this.view === 'agenda') this.renderAgenda(main);
    else if (this.view === 'calendar') this.renderCalendar(main);
    else if (this.view === 'dashboard') this.renderDashboard(main);
    this.drawerEl = c.createEl('aside', { cls: 'pb-drawer' });
    this.scrimEl = c.createEl('div', { cls: 'pb-scrim' });
    this.scrimEl.addEventListener('click', () => this.closeDrawer());
    if (this.selId) { const sel = findTask(this.allTasks(), this.selId); if (sel) this.openCard(sel); else this.selId = null; }
    if (this.plugin._pendingNew) {
      const pn = this.plugin._pendingNew;
      const ms = this.allTasks().filter(t => t.lane === pn.lane && t.title === pn.title);
      const nt = ms[ms.length - 1];
      if (nt) { this.plugin._pendingNew = null; this.openCard(nt); this.focusDrawerTitle(); }
    }
  }
  focusDrawerTitle() {
    const el = this.drawerEl && this.drawerEl.querySelector('.dw-title');
    if (!el) return;
    el.focus();
    const r = document.createRange(); r.selectNodeContents(el);
    const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  }

  setView(v) { this.view = v; this.selId = null; this.persist(); this.render(); }

  renderRail(c) {
    const rail = c.createEl('nav', { cls: 'pb-rail' });
    const p = this.plugin.prof();
    const chip = rail.createEl('button', { cls: 'pb-brand pb-profchip', attr: { title: tr('Bảng: ') + p.name + ' — bấm để đổi' } });
    paintProfChip(chip, p, this.app);
    chip.addEventListener('click', ev => { ev.stopPropagation(); this.openProfileMenu(chip); });
    const navs = [['board', I.board, tr('Bảng')], ['list', I.listNav, tr('Danh sách')], ['agenda', I.bell, tr('Nhắc lịch')], ['calendar', I.calNav, tr('Lịch')], ['dashboard', I.dash, tr('Thống kê')]];
    navs.forEach(([v, ic, title]) => {
      const b = rail.createEl('button', { cls: 'pb-railbtn' + (this.view === v ? ' on' : ''), attr: { title } });
      b.innerHTML = ic;
      b.addEventListener('click', () => this.setView(v));
    });
    const rl = rail.createEl('button', { cls: 'pb-railbtn', attr: { title: tr('Tải lại') } }); rl.innerHTML = I.refresh;
    rl.addEventListener('click', () => this.plugin.reload());
    const op = rail.createEl('button', { cls: 'pb-railbtn', attr: { title: tr('Mở ') + this.plugin.prof().taskPath } }); op.innerHTML = I.open;
    op.addEventListener('click', () => { if (this.plugin.taskFile) this.app.workspace.getLeaf(true).openFile(this.plugin.taskFile); });
    rail.createEl('div', { cls: 'pb-rail-sp' });
    return rail;
  }

  renderHeaderBar(main) {
    const tasks = this.allTasks();
    const head = main.createEl('div', { cls: 'pb-head' });
    const hl = head.createEl('div', { cls: 'pb-head-l' });
    hl.createEl('div', { cls: 'pb-title', text: 'Pie Tasks' });
    const overdue = tasks.filter(t => t.over).length, doneN = tasks.filter(t => t.done).length;
    hl.createEl('div', { cls: 'pb-sub', text: tasks.length + tr(' việc · ') + overdue + tr(' quá hạn · ') + doneN + tr(' hoàn thành') });
    if (this.view === 'board') {
      const seg = head.createEl('div', { cls: 'pb-viewseg' });
      VIEWS.forEach(([k, lab]) => {
        const b = seg.createEl('button', { cls: 'pb-vseg' + (k === this.viewMode ? ' on' : ''), text: tr(lab) });
        b.addEventListener('click', () => { this.viewMode = k; this.persist(); this.render(); });
      });
      const add = head.createEl('button', { cls: 'pb-icon-btn', attr: { title: tr('Thêm việc') } }); add.innerHTML = I.plus;
      add.addEventListener('click', () => { const ls = this.plugin.taskData.lanes; if (ls.length) this.plugin.addTask(ls[0]); });
    }
  }

  // ---------- BOARD ----------
  renderBoard(main) {
    if (this.viewMode !== 'all') this.renderDayStrip(main);
    this.renderStatusbar(main);
    const tasks = this.allTasks();
    const lanes = this.plugin.taskData.lanes;
    const board = main.createEl('div', { cls: 'pb-board' });
    const cols = board.createEl('div', { cls: 'pb-cols' });
    lanes.forEach((laneRaw, li) => {
      const all = tasks.filter(t => t.lane === laneRaw);
      const list = all.filter(t => this.visible(t));
      list.sort((a, b) => (PRIO_ORDER[b.prio || 'normal'] - PRIO_ORDER[a.prio || 'normal'])
        || ((a.date || '9999-99-99').localeCompare(b.date || '9999-99-99'))
        || (a.line - b.line));
      const nm = laneName(laneRaw);
      const tone = LANE_TONES[li % LANE_TONES.length];
      const laneColor = ((this.plugin.prof().laneStyles || {})[nm] || {}).color || TONE[tone];
      const isCol = this.collapsed.has(nm);
      const col = cols.createEl('div', { cls: 'pb-col' + (isCol ? ' collapsed' : '') + (this.selLane === nm ? ' sel-lane' : '') });
      col.dataset.lane = nm; col.style.setProperty('--lane-c', laneColor);
      const selectLane = ev => { if (ev.target.closest('button, a')) return; this.selLane = this.selLane === nm ? null : nm; this.render(); };
      const hc = col.createEl('div', { cls: 'pb-headcol' });
      hc.addEventListener('click', selectLane);
      const fold = hc.createEl('button', { cls: 'pb-fold', attr: { title: tr('Thu/mở') } }); fold.innerHTML = I.chev;
      fold.addEventListener('click', ev => { ev.stopPropagation(); this.toggleLane(nm); });
      if (isCol) { const fl = col.createEl('div', { cls: 'pb-col-foldlabel', text: nm }); fl.addEventListener('click', selectLane); this.wireLaneDrag(fl, col, nm); this.wireDrop(col, nm); return; }
      this.wireLaneDrag(hc, col, nm);
      const ic = hc.createEl('span', { cls: 'pb-headic' }); ic.style.background = laneColor; ic.innerHTML = I[laneIcon(laneRaw)] || I.list;
      const nmEl = hc.createEl('span', { cls: 'pb-headnm', text: nm, attr: { title: tr('Bấm chọn · nhấp đúp để đổi tên') } });
      nmEl.addEventListener('dblclick', ev => { ev.stopPropagation(); this.plugin.renameLane(nm); });
      hc.createEl('span', { cls: 'pb-headct', text: String(list.length) });
      const menu = hc.createEl('button', { cls: 'pb-lanemenu', attr: { title: tr('Tuỳ chọn lane') } }); menu.innerHTML = I.dots;
      menu.addEventListener('click', ev => { ev.stopPropagation(); this.openLaneMenu(nm, laneRaw, menu); });
      if (!list.length) col.createEl('div', { cls: 'pb-col-empty', text: tr('Không có việc') });
      else list.forEach(t => this.renderCard(col, t));
      const addb = col.createEl('button', { cls: 'pb-lane-add' }); addb.innerHTML = I.plus + tr('Thêm việc');
      addb.addEventListener('click', ev => { ev.stopPropagation(); this.plugin.addTask(laneRaw); });
      this.wireDrop(col, nm);
    });
  }

  renderDayStrip(main) {
    const strip = main.createEl('div', { cls: 'pb-daystrip' });
    const [ws] = weekRange(this.anchor);
    const start = dOnly(ws);
    const tod = today();
    const days = [];
    for (let i = 0; i < 14; i++) { const d = new Date(start); d.setDate(start.getDate() + i); days.push(iso(d)); }
    const wdName = d => ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][dOnly(d).getDay()];
    const r = activeRange(this.viewMode, this.anchor, this.rangeStart, this.rangeEnd);
    const tasks = this.allTasks();
    const wrap = strip.createEl('div', { cls: 'pb-days' });
    days.forEach(d => {
      const cnt = tasks.filter(t => t.date === d).length;
      const inR = r && d >= r[0] && d <= r[1];
      const b = wrap.createEl('div', { cls: 'pb-day' + (d === tod ? ' today' : '') + (inR ? ' inrange' : '') + (d === this.anchor && this.viewMode !== 'range' ? ' sel' : ''), attr: { role: 'button', tabindex: '0' } });
      if (cnt) b.createEl('span', { cls: 'pb-day-badge', text: String(cnt) });
      b.createEl('div', { cls: 'pb-day-wd', text: wdName(d) });
      b.createEl('div', { cls: 'pb-day-dn', text: d.slice(8) });
      b.addEventListener('click', () => {
        if (this.viewMode === 'range') { if (d < this.rangeStart || this.rangeEnd !== this.rangeStart) { this.rangeStart = d; this.rangeEnd = d; } else this.rangeEnd = d; }
        else this.anchor = d;
        this.render();
      });
    });
    const tools = strip.createEl('div', { cls: 'pb-ds-tools' });
    if (this.viewMode === 'range') {
      const fromI = tools.createEl('input', { cls: 'pb-vfsel pb-vfdate pb-dsdate', attr: { type: 'date' } });
      fromI.value = this.rangeStart;
      fromI.addEventListener('change', () => { if (!fromI.value) return; this.rangeStart = fromI.value; if (this.rangeEnd < this.rangeStart) this.rangeEnd = this.rangeStart; this.anchor = this.rangeStart; this.render(); });
      tools.createEl('span', { cls: 'pb-vfarrow', text: '→' });
      const toI = tools.createEl('input', { cls: 'pb-vfsel pb-vfdate pb-dsdate', attr: { type: 'date' } });
      toI.value = this.rangeEnd;
      toI.addEventListener('change', () => { if (!toI.value) return; this.rangeEnd = toI.value; if (this.rangeEnd < this.rangeStart) this.rangeStart = this.rangeEnd; this.render(); });
    } else {
      tools.createEl('span', { cls: 'pb-scope', text: this.scopeLabel() });
    }
    const tb = tools.createEl('button', { cls: 'pb-icon-btn', attr: { title: tr('Về hôm nay') } }); tb.innerHTML = I.clock;
    tb.addEventListener('click', () => { this.anchor = tod; this.rangeStart = this.rangeEnd = tod; this.render(); });
  }
  scopeLabel() { const r = activeRange(this.viewMode, this.anchor, this.rangeStart, this.rangeEnd); if (!r) return tr('Tất cả'); if (this.viewMode === 'day') return tr('Ngày ') + fmtDate(r[0]); if (this.viewMode === 'month') return tr('Tháng ') + (+r[0].split('-')[1]); return fmtDate(r[0]) + ' – ' + fmtDate(r[1]); }

  renderStatusbar(main) {
    const tasks = this.allTasks();
    const bar = main.createEl('div', { cls: 'pb-statusbar' });
    const cnt = k => k === 'all' ? tasks.length : k === 'over' ? tasks.filter(t => t.over).length : k === 'completed' ? tasks.filter(t => t.done || t.status === 'completed').length : tasks.filter(t => t.status === k && !t.over && !t.done).length;
    const chips = [['all', tr('Tất cả'), '#8A8F98'], ...FILTER_ORDER.map(k => [k, tr(STATES[k].lab), STATES[k].c])];
    chips.forEach(([k, lab, col]) => {
      const b = bar.createEl('button', { cls: 'pb-sf' + (k === this.filter ? ' on' : '') });
      b.style.setProperty('--sfc', col);
      b.createEl('span', { cls: 'dot' }); b.appendText(lab + ' '); b.createEl('span', { cls: 'n', text: String(cnt(k)) });
      b.addEventListener('click', () => { this.filter = k; this.render(); });
    });
    const al = bar.createEl('button', { cls: 'pb-add-lane' }); al.innerHTML = I.plus + tr('Thêm lane');
    al.addEventListener('click', () => this.plugin.addLane());
  }

  renderCard(colEl, t) {
    const rs = t.done ? 'completed' : (t.status && t.status !== 'open' ? t.status : 'open');
    const RS = STATES[rs];
    const cc = t.over ? STATES.over.c : RS.c;
    const card = colEl.createEl('div', { cls: 'ev is-' + rs + (t.over ? ' ov' : '') + (t.prio === 'high' && !t.done ? ' pri-high' : '') + (taskKey(t) === this.selId ? ' sel' : ''), attr: { role: 'button', tabindex: '0', draggable: 'true' } });
    card.dataset.key = taskKey(t);
    card.style.setProperty('--c', cc); card.style.setProperty('--sc', cc);
    const top = card.createEl('div', { cls: 'ev-top' });
    const tile = top.createEl('span', { cls: 'ev-tile' }); tile.innerHTML = I[cardIcon(t)] || I.list;
    if (t.startDate || t.date || t.s) { const chip = top.createEl('span', { cls: 'ev-time-chip' }); chip.innerHTML = I.clock; let x = ''; if (t.startDate && t.date && t.startDate !== t.date) x = fmtDate(t.startDate) + '→' + fmtDate(t.date); else if (t.date) x = fmtDate(t.date); else if (t.startDate) x = fmtDate(t.startDate); if (t.s && t.e) x += (x ? ' · ' : '') + t.s + '–' + t.e; chip.appendText(x); }
    const title = card.createEl('div', { cls: 'ev-title' });
    if (t.pri && !t.done) title.createEl('span', { cls: 'ev-pri' });
    title.appendText(t.title);
    const bottom = card.createEl('div', { cls: 'ev-bottom' });
    const chips = bottom.createEl('div', { cls: 'ev-chips' });
    const state = chips.createEl('span', { cls: 'ev-state' }); state.innerHTML = SI[rs] || SI.dot; state.appendText(tr(RS.lab));
    if (t.over) { const ov = chips.createEl('span', { cls: 'ev-over' }); ov.innerHTML = SI.over; ov.appendText(tr('Quá hạn')); }
    if (t.check.length) { const cc = chips.createEl('span', { cls: 'ev-check', text: '✓ ' + t.check.filter(x => x[1]).length + '/' + t.check.length }); }
    if (t.eisen && EISEN[t.eisen]) { const eb = chips.createEl('span', { cls: 'ev-eisen', text: EISEN[t.eisen].short }); eb.style.color = EISEN[t.eisen].c; eb.style.background = 'color-mix(in srgb,' + EISEN[t.eisen].c + ' 15%,transparent)'; }
    const pgi = progressInfo(t, today());
    if (pgi) {
      const pr = bottom.createEl('div', { cls: 'ev-prog' });
      const track = pr.createEl('div', { cls: 'ev-prog-track' });
      const fill = track.createEl('div', { cls: 'ev-prog-fill' }); fill.style.width = pgi.actual + '%'; fill.style.background = pgi.color;
      if (pgi.expected != null) { const mk = track.createEl('div', { cls: 'ev-prog-exp' }); mk.style.left = pgi.expected + '%'; mk.title = tr('Dự kiến ') + pgi.expected + '%'; }
      const lb = pr.createEl('span', { cls: 'ev-prog-lb', text: pgi.actual + '%' + (pgi.diff != null && pgi.diff < 0 ? ' · ' + tr('trễ ') + Math.abs(pgi.diff) + '%' : '') }); lb.style.color = pgi.color;
    }
    if (this.plugin.settings.stepsOnCard && t.check.length) {
      const steps = bottom.createEl('div', { cls: 'ev-steps' });
      t.check.forEach((x, i) => {
        const st = steps.createEl('div', { cls: 'ev-step' + (x[1] ? ' ok' : '') });
        st.createEl('span', { cls: 'ev-step-box' }).innerHTML = I.check;
        st.createEl('span', { cls: 'ev-step-tx', text: x[0] });
        if (x[2]) avEl(st, x[2].name, 'ev-step-av');
        st.addEventListener('click', ev => { ev.stopPropagation(); this.plugin.toggleCheck(t, i); });
      });
    }
    if (t.note) { const nt = bottom.createEl('div', { cls: 'ev-note' }); nt.appendText(t.note); }
    const people = bottom.createEl('div', { cls: 'ev-people' });
    const owners = ownersOf(t);
    if (owners.length) { const av = people.createEl('span', { cls: 'avatars' }); owners.slice(0, 3).forEach(o => avEl(av, o)); people.createEl('span', { cls: 'ev-going', text: owners.length > 1 ? owners.length + tr(' người') : owners[0] }); }
    else people.createEl('span', { cls: 'ev-going', text: tr('Chưa giao') });
    card.addEventListener('click', () => this.openCard(t));
    card.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); this.openCard(t); } });
    card.addEventListener('dragstart', ev => { ev.dataTransfer.setData('text/plain', taskKey(t)); ev.dataTransfer.effectAllowed = 'move'; card.classList.add('dragging'); this._draggingKey = taskKey(t); this._dragEl = card; this._dragAnchor = null; this._reorderCommitted = false; });
    card.addEventListener('dragend', () => { card.classList.remove('dragging'); this._draggingKey = null; this._dragEl = null; this._dragAnchor = null; this._clearCardIndicators(); if (!this._reorderCommitted) this.render(); this._reorderCommitted = false; });
  }
  _clearLaneIndicators() { if (this.root) this.root.querySelectorAll('.lane-drop-before,.lane-drop-after').forEach(e => e.classList.remove('lane-drop-before', 'lane-drop-after')); }
  _clearCardIndicators() { if (this.root) this.root.querySelectorAll('.pb-card-before,.pb-card-after').forEach(e => e.classList.remove('pb-card-before', 'pb-card-after')); }
  _cardsIn(col, dragKey) { return [...col.querySelectorAll('.ev')].filter(c => c.dataset.key && c.dataset.key !== dragKey); }
  _cardBeforeAt(col, y, dragKey) { for (const c of this._cardsIn(col, dragKey)) { const r = c.getBoundingClientRect(); if (y < r.top + r.height / 2) return c; } return null; }
  wireLaneDrag(handle, col, nm) {
    // Pattern obsidian-tasks: chỉ bật draggable KHI mousedown vào handle → kéo CẢ cột (ghost full chiều dài), không đụng card
    handle.addEventListener('mousedown', ev => { if (ev.target.closest('button, a')) return; col.draggable = true; });
    handle.addEventListener('mouseup', () => { col.draggable = false; });
    col.addEventListener('dragstart', ev => {
      if (col.draggable !== true) return; // card kéo sẽ bubble lên đây → bỏ qua
      ev.dataTransfer.setData('application/x-pie-lane', nm); ev.dataTransfer.effectAllowed = 'move';
      this._laneDrag = nm; col.classList.add('lane-dragging');
    });
    col.addEventListener('dragend', () => { col.draggable = false; this._laneDrag = null; col.classList.remove('lane-dragging'); this._clearLaneIndicators(); });
  }
  wireDrop(col, laneNm) {
    col.addEventListener('dragover', ev => {
      ev.preventDefault();
      if (this._laneDrag) {
        if (this._laneDrag === laneNm) return;
        ev.dataTransfer.dropEffect = 'move';
        const r = col.getBoundingClientRect(); const after = ev.clientX > r.left + r.width / 2;
        col.classList.toggle('lane-drop-after', after); col.classList.toggle('lane-drop-before', !after);
      } else if (this._dragEl) {
        // kéo card → dịch card LIVE tới vị trí con trỏ (card khác nhường chỗ ngay)
        ev.dataTransfer.dropEffect = 'move';
        const before = this._cardBeforeAt(col, ev.clientY, this._draggingKey);
        const anchor = before ? before.dataset.key : '__end__';
        if (this._dragEl.parentElement !== col || this._dragAnchor !== anchor) {
          this._dragAnchor = anchor;
          col.insertBefore(this._dragEl, before || col.querySelector('.pb-lane-add'));
        }
      } else col.classList.add('drop-hover');
    });
    col.addEventListener('dragleave', ev => {
      const r = col.getBoundingClientRect();
      if (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom) col.classList.remove('drop-hover', 'lane-drop-before', 'lane-drop-after');
    });
    col.addEventListener('drop', ev => {
      ev.preventDefault(); col.classList.remove('drop-hover', 'lane-drop-before', 'lane-drop-after');
      const laneSrc = ev.dataTransfer.getData('application/x-pie-lane');
      if (laneSrc) { if (laneSrc !== laneNm) { const r = col.getBoundingClientRect(); const before = ev.clientX <= r.left + r.width / 2; this.plugin.moveLane(laneSrc, laneNm, before); } return; }
      const key = ev.dataTransfer.getData('text/plain');
      if (key && this._dragEl) {
        // card đã được dịch live tới đúng chỗ → đọc card kế sau nó làm mốc
        let sib = this._dragEl.nextElementSibling;
        while (sib && !sib.classList.contains('ev')) sib = sib.nextElementSibling;
        this._reorderCommitted = true;
        this.plugin.moveTaskToPos(key, laneNm, sib ? sib.dataset.key : null);
      }
    });
  }

  toggleLane(nm) { if (this.collapsed.has(nm)) this.collapsed.delete(nm); else this.collapsed.add(nm); this.persist(); this.render(); }

  openLaneMenu(nm, laneRaw, btn) {
    this.closeLaneMenu();
    const pop = document.createElement('div'); pop.className = 'pb-lane-pop'; this._lanePop = pop;
    const items = [[tr('Sửa tên lane'), () => this.plugin.renameLane(nm)], ['div'], [tr('Chèn lane trước'), () => this.plugin.insertLane(nm, true)], [tr('Chèn lane sau'), () => this.plugin.insertLane(nm, false)], ['div'], [tr('Sắp xếp theo tên'), () => this.plugin.sortLane(nm, 'text')], [tr('Sắp xếp theo hạn'), () => this.plugin.sortLane(nm, 'due')], ['div'], [tr('Xoá lane'), () => this.plugin.deleteLane(nm), 'danger']];
    items.forEach(it => { if (it[0] === 'div') { pop.createDiv('pb-pop-div'); return; } const b = pop.createEl('button', { text: it[0], cls: it[2] || '' }); b.addEventListener('click', () => { this.closeLaneMenu(); it[1](); }); });
    document.body.appendChild(pop);
    const r = btn.getBoundingClientRect();
    pop.style.top = (r.bottom + 6) + 'px';
    pop.style.left = Math.max(8, Math.min(r.left, window.innerWidth - pop.offsetWidth - 8)) + 'px';
    this._laneOutside = ev => { if (!pop.contains(ev.target)) this.closeLaneMenu(); };
    setTimeout(() => document.addEventListener('mousedown', this._laneOutside), 0);
  }
  closeLaneMenu() { if (this._lanePop) { this._lanePop.remove(); this._lanePop = null; } if (this._laneOutside) { document.removeEventListener('mousedown', this._laneOutside); this._laneOutside = null; } }

  openProfileMenu(btn) {
    this.closeProfileMenu();
    const pop = document.createElement('div'); pop.className = 'pb-prof-pop'; this._profPop = pop;
    pop.setAttribute('data-theme', this.theme());
    pop.createEl('div', { cls: 'pb-prof-hd', text: tr('Bảng của bạn') });
    const list = pop.createEl('div', { cls: 'pb-prof-list' });
    const active = this.plugin.settings.activeId;
    this.plugin.settings.profiles.forEach(p => {
      const b = list.createEl('button', { cls: 'pb-prof-row' + (p.id === active ? ' on' : '') });
      const sw = b.createEl('span', { cls: 'pb-prof-sw' }); paintProfChip(sw, p, this.app);
      b.createEl('span', { cls: 'pb-prof-nm', text: p.name });
      const ck = b.createEl('span', { cls: 'pb-prof-ck' }); if (p.id === active) ck.innerHTML = I.check;
      b.addEventListener('click', () => { this.closeProfileMenu(); this.plugin.switchProfile(p.id); });
    });
    pop.createDiv('pb-prof-div');
    const foot = pop.createEl('div', { cls: 'pb-prof-foot' });
    const add = foot.createEl('button', { cls: 'pb-prof-act' }); add.createEl('span', { cls: 'pb-prof-ai' }).innerHTML = I.plus; add.appendText(tr('Thêm bảng mới'));
    add.addEventListener('click', () => { this.closeProfileMenu(); this.plugin.addProfile(); });
    const mng = foot.createEl('button', { cls: 'pb-prof-act' }); mng.createEl('span', { cls: 'pb-prof-ai' }).innerHTML = I.gear; mng.appendText(tr('Quản lý bảng'));
    mng.addEventListener('click', () => { this.closeProfileMenu(); this.openProfileManager(); });
    document.body.appendChild(pop);
    const r = btn.getBoundingClientRect();
    let top = r.top, left = Math.min(r.right + 10, window.innerWidth - pop.offsetWidth - 8);
    if (top + pop.offsetHeight > window.innerHeight - 8) top = Math.max(8, window.innerHeight - pop.offsetHeight - 8);
    pop.style.top = top + 'px'; pop.style.left = left + 'px';
    this._profOutside = ev => { if (!pop.contains(ev.target)) this.closeProfileMenu(); };
    setTimeout(() => document.addEventListener('mousedown', this._profOutside), 0);
  }
  closeProfileMenu() { if (this._profPop) { this._profPop.remove(); this._profPop = null; } if (this._profOutside) { document.removeEventListener('mousedown', this._profOutside); this._profOutside = null; } }
  openProfileManager() { new ProfileManagerModal(this.app, this.plugin).open(); }

  // ---------- DRAWER ----------
  openCard(t) {
    this.selId = taskKey(t);
    const st = this.cardState(t), S = STATES[st];
    const dw = this.drawerEl; dw.empty();
    const scroll = dw.createEl('div', { cls: 'dw-scroll' });
    const dh = scroll.createEl('div', { cls: 'dw-head' });
    const tile = dh.createEl('span', { cls: 'dw-tile' }); tile.style.background = S.c; tile.innerHTML = I[cardIcon(t)] || I.list;
    const titleEl = dh.createEl('h2', { cls: 'dw-title', text: t.title, attr: { contenteditable: 'true', spellcheck: 'false' } });
    titleEl.addEventListener('blur', () => {
      const v = titleEl.textContent.trim();
      if (v && v !== t.title) {
        if (!t.id) this.selId = t.lane + '::' + v + '::' + t.line; // giữ drawer mở: đón trước key mới theo tiêu đề
        this.plugin.setTitle(t, v);
      }
    });
    const close = dh.createEl('button', { cls: 'dw-close' }); close.innerHTML = I.x; close.addEventListener('click', () => this.closeDrawer());
    // when
    const when = scroll.createEl('div', { cls: 'dw-when' }); when.innerHTML = I.clock;
    let w = t.date ? fmtDateFull(t.date) : tr('Chưa có ngày');
    if (t.startDate && t.date && t.startDate !== t.date) w = fmtDateFull(t.startDate) + ' → ' + fmtDateFull(t.date);
    else if (t.startDate && !t.date) w = fmtDateFull(t.startDate);
    if (t.s && t.e) w += ' · ' + t.s + ' → ' + t.e;
    when.createEl('span', { text: w });
    const badge = when.createEl('span', { cls: 'badge', text: tr(S.lab) }); badge.style.background = 'color-mix(in srgb,' + S.c + ' 18%,transparent)'; badge.style.color = S.c;
    // dự án (project cha)
    const secPr = scroll.createEl('div', { cls: 'dw-sec' });
    secPr.createEl('div', { cls: 'eyebrow', text: tr('Dự án') });
    if (t.project) {
      const nm = t.project.replace(/^\[\[|\]\]$/g, '');
      const disp = (nm.split('|').pop() || nm).split('/').pop();
      const row = secPr.createEl('div', { cls: 'dw-link dw-proj' });
      const ico = row.createEl('span', { cls: 'dw-link-ic' }); ico.innerHTML = I.folder;
      const a = row.createEl('a', { cls: 'dw-link-a', text: disp });
      a.addEventListener('click', ev => { ev.preventDefault(); this.app.workspace.openLinkText(nm, this.plugin.taskFile ? this.plugin.taskFile.path : '', false); });
      const rx = row.createEl('button', { cls: 'pb-x', attr: { title: tr('Gỡ khỏi dự án') } }); rx.innerHTML = I.x;
      rx.addEventListener('click', ev => { ev.stopPropagation(); this.plugin.removeProject(t); });
    } else {
      const addP = secPr.createEl('div', { cls: 'add-more' }); addP.innerHTML = I.folder; addP.appendText(tr('Gắn vào dự án'));
      addP.addEventListener('click', () => this.plugin.pickProject(t));
    }
    // ghi chú (nhắc thông tin quan trọng)
    const secN = scroll.createEl('div', { cls: 'dw-sec' }); secN.createEl('div', { cls: 'eyebrow', text: tr('Ghi chú') });
    const ntIn = secN.createEl('input', { cls: 'dt-in dw-note-in', attr: { type: 'text', placeholder: tr('Ghi chú nhắc nhở…') } });
    if (t.note) ntIn.value = t.note;
    ntIn.addEventListener('change', () => this.plugin.setNote(t, ntIn.value.trim()));
    // time editors
    const secT = scroll.createEl('div', { cls: 'dw-sec' }); secT.createEl('div', { cls: 'eyebrow', text: tr('Thời gian') });
    const grid = secT.createEl('div', { cls: 'dt-grid' });
    const mkGroup = (lab, timeVal, onTime, dateVal, onDate) => {
      const g = grid.createEl('div', { cls: 'dt-group' });
      g.createEl('span', { cls: 'dt-group-lab', text: lab });
      const row = g.createEl('div', { cls: 'dt-group-row' });
      const mk = (type, val, on) => { const inp = row.createEl('input', { cls: 'dt-in dt-in-' + type, attr: { type } }); if (val) inp.value = val; inp.addEventListener('change', () => on(inp.value)); return inp; };
      mk('time', timeVal, onTime);
      mk('date', dateVal, onDate);
    };
    mkGroup(tr('Bắt đầu'), t.s || '', v => this.plugin.setTime(t, v, t.e || v), t.startDate || '', v => this.plugin.setStartDate(t, v));
    mkGroup(tr('Kết thúc'), t.e || '', v => this.plugin.setTime(t, t.s || v, v), t.date || '', v => this.plugin.setDate(t, v));
    // status
    const active = this.activeStatus(t);
    const secS = scroll.createEl('div', { cls: 'dw-sec' }); secS.createEl('div', { cls: 'eyebrow', text: tr('Trạng thái') });
    const dd = secS.createEl('div', { cls: 'dw-dd' });
    const trig = dd.createEl('button', { cls: 'dw-dd-trig', attr: { type: 'button' } });
    const ac = this.activeStatus(t) || 'open'; const aic = trig.createEl('span', { cls: 'dw-dd-ic' }); aic.innerHTML = SI[ac] || SI.dot; aic.style.color = STATES[ac].c; trig.createEl('span', { cls: 'dw-dd-lb', text: tr(STATES[ac].lab) }); const ch = trig.createEl('span', { cls: 'dw-dd-ch' }); ch.innerHTML = I.chev;
    const menu = dd.createEl('div', { cls: 'dw-dd-menu' });
    const closeDD = () => { dd.classList.remove('open'); if (this._ddOutside) { document.removeEventListener('mousedown', this._ddOutside); this._ddOutside = null; } };
    SETTABLE.forEach(k => { const o = menu.createEl('button', { cls: 'dw-dd-opt' + (active === k ? ' on' : ''), attr: { type: 'button' } }); const ic = o.createEl('span', { cls: 'dw-dd-ic' }); ic.innerHTML = SI[k] || SI.dot; ic.style.color = STATES[k].c; o.createEl('span', { text: tr(STATES[k].lab) }); o.addEventListener('click', ev => { ev.stopPropagation(); closeDD(); this.plugin.setStatus(t, k); }); });
    trig.addEventListener('click', ev => { ev.stopPropagation(); const willOpen = !dd.classList.contains('open'); if (willOpen) { dd.classList.add('open'); this._ddOutside = e => { if (!dd.contains(e.target)) closeDD(); }; setTimeout(() => document.addEventListener('mousedown', this._ddOutside), 0); } else closeDD(); });
    // tiến độ
    const dpi = progressInfo(t, today()); const actNow = actualProgress(t);
    if (actNow != null || t.startDate || t.date || t.check.length) {
      const secPg = scroll.createEl('div', { cls: 'dw-sec' }); secPg.createEl('div', { cls: 'eyebrow', text: tr('Tiến độ') });
      const track = secPg.createEl('div', { cls: 'ev-prog-track dw-prog-track' });
      const fill = track.createEl('div', { cls: 'ev-prog-fill' }); fill.style.width = (actNow || 0) + '%'; fill.style.background = dpi ? dpi.color : '#5B93D6';
      if (dpi && dpi.expected != null) { const mk = track.createEl('div', { cls: 'ev-prog-exp' }); mk.style.left = dpi.expected + '%'; }
      const info = secPg.createEl('div', { cls: 'dw-prog-info' });
      info.createEl('span', { text: tr('Thực tế ') + (actNow != null ? actNow + '%' : '—') });
      if (dpi && dpi.expected != null) info.createEl('span', { text: ' · ' + tr('Dự kiến ') + dpi.expected + '%' });
      if (dpi && dpi.diff != null && dpi.diff < 0) { const w = info.createEl('span', { text: ' · ' + tr('trễ ') + Math.abs(dpi.diff) + '%' }); w.style.color = dpi.color; w.style.fontWeight = '700'; }
      const mrow = secPg.createEl('label', { cls: 'dw-prog-manual' });
      mrow.createEl('span', { text: tr('% tự nhập') });
      const pin = mrow.createEl('input', { cls: 'dt-in', attr: { type: 'number', min: '0', max: '100', placeholder: (t.check.length ? tr('theo đầu việc') : '') } });
      if (t.pct != null) pin.value = String(t.pct);
      pin.addEventListener('change', () => this.plugin.setPct(t, pin.value === '' ? null : pin.value));
    }
    // priority
    const secP = scroll.createEl('div', { cls: 'dw-sec' }); secP.createEl('div', { cls: 'eyebrow', text: tr('Độ ưu tiên') });
    const pSel = secP.createEl('div', { cls: 'st-select' });
    ['high', 'med', 'normal', 'low'].forEach(k => { const on = (t.prio || 'normal') === k; const o = pSel.createEl('div', { cls: 'st-opt' + (on ? ' on' : ''), attr: { role: 'button' }, text: tr(PRI[k].lab) }); o.style.setProperty('--oc', PRI[k].c); o.addEventListener('click', () => this.plugin.setPriority(t, k)); });
    // ma trận Eisenhower (nhãn chiến lược, không ảnh hưởng sort)
    const secE = scroll.createEl('div', { cls: 'dw-sec' }); secE.createEl('div', { cls: 'eyebrow', text: tr('Ma trận Eisenhower') });
    const eSel = secE.createEl('div', { cls: 'st-select' });
    ['q1', 'q2', 'q3', 'q4'].forEach(k => { const on = t.eisen === k; const o = eSel.createEl('div', { cls: 'st-opt' + (on ? ' on' : ''), attr: { role: 'button', title: tr(EISEN[k].lab) }, text: EISEN[k].short }); o.style.setProperty('--oc', EISEN[k].c); o.addEventListener('click', () => this.plugin.setEisen(t, t.eisen === k ? null : k)); });
    // move lane (thay cho kéo-thả trên mobile)
    const secM = scroll.createEl('div', { cls: 'dw-sec' });
    secM.createEl('div', { cls: 'eyebrow', text: tr('Chuyển lane') });
    const laneSel = secM.createEl('div', { cls: 'st-select' });
    (this.plugin.taskData.lanes || []).forEach(laneRaw => {
      const nm = laneName(laneRaw); const on = nm === t.laneName;
      const o = laneSel.createEl('div', { cls: 'st-opt' + (on ? ' on' : ''), attr: { role: 'button' }, text: nm });
      o.style.setProperty('--oc', '#2F6DB0');
      if (!on) o.addEventListener('click', () => this.plugin.moveTask(taskKey(t), nm));
    });
    // assignee
    const secA = scroll.createEl('div', { cls: 'dw-sec' });
    const eyA = secA.createEl('div', { cls: 'eyebrow' }); eyA.appendText('Giao cho · ' + t.laneName);
    const owners = ownersOf(t);
    owners.forEach(o => { const g = secA.createEl('div', { cls: 'guest' }); avEl(g, o, 'av2'); const gt = g.createEl('div'); gt.createEl('div', { cls: 'nm', text: o }); gt.createEl('div', { cls: 'rl', text: tr('Phụ trách') }); const gx = g.createEl('button', { cls: 'pb-x', attr: { title: tr('Gỡ người này') } }); gx.innerHTML = I.x; gx.addEventListener('click', () => this.plugin.removeMember(t, o)); });
    const addm = secA.createEl('div', { cls: 'add-more' }); addm.innerHTML = I.userPlus; addm.appendText(tr('Thêm người'));
    addm.addEventListener('click', () => this.plugin.addMember(t));
    // checklist
    const secC = scroll.createEl('div', { cls: 'dw-sec' });
    const doneN = t.check.filter(x => x[1]).length;
    secC.createEl('div', { cls: 'eyebrow', text: tr('Việc kế tiếp · ') + doneN + '/' + t.check.length });
    t.check.forEach((x, i) => { const ci = secC.createEl('div', { cls: 'check-item' + (x[1] ? ' ok' : '') }); const box = ci.createEl('span', { cls: 'check-box' }); box.innerHTML = I.check; ci.createEl('span', { cls: 'ci-text', text: x[0] }); if (x[2]) { const av = avEl(ci, x[2].name, 'ci-av'); av.title = x[2].name; } const ce = ci.createEl('button', { cls: 'pb-x', attr: { title: tr('Sửa / gán người việc con') } }); ce.innerHTML = I.edit; ce.addEventListener('click', ev => { ev.stopPropagation(); this.plugin.editStep(t, i, x[0], x[2] || null); }); const cx = ci.createEl('button', { cls: 'pb-x', attr: { title: tr('Xoá bước') } }); cx.innerHTML = I.x; cx.addEventListener('click', ev => { ev.stopPropagation(); this.plugin.deleteStep(t, i); }); ci.addEventListener('click', () => this.plugin.toggleCheck(t, i)); });
    if (t.next && !t.check.length) secC.createEl('p', { cls: 'dw-desc', text: t.next });
    const addStep = secC.createEl('div', { cls: 'add-more' }); addStep.innerHTML = I.plus; addStep.appendText(tr('Thêm bước'));
    addStep.addEventListener('click', () => this.plugin.addStep(t));
    // tài liệu / file liên quan (output)
    const secO = scroll.createEl('div', { cls: 'dw-sec' });
    secO.createEl('div', { cls: 'eyebrow', text: tr('Tài liệu · file liên quan') });
    (t.outputs || []).forEach(o => {
      const nm = o.replace(/^\[\[|\]\]$/g, '');
      const row = secO.createEl('div', { cls: 'dw-link' });
      const ico = row.createEl('span', { cls: 'dw-link-ic' }); ico.innerHTML = I.link;
      const a = row.createEl('a', { cls: 'dw-link-a', text: nm });
      a.addEventListener('click', ev => { ev.preventDefault(); this.app.workspace.openLinkText(nm, this.plugin.taskFile ? this.plugin.taskFile.path : '', false); });
      const rx = row.createEl('button', { cls: 'pb-x', attr: { title: tr('Gỡ liên kết') } }); rx.innerHTML = I.x;
      rx.addEventListener('click', ev => { ev.stopPropagation(); this.plugin.removeOutput(t, nm); });
    });
    const addLink = secO.createEl('div', { cls: 'add-more' }); addLink.innerHTML = I.plus; addLink.appendText(tr('Gắn note/file'));
    addLink.addEventListener('click', () => this.plugin.attachOutput(t));
    if (t.id) { const secId = scroll.createEl('div', { cls: 'dw-sec' }); secId.createEl('div', { cls: 'eyebrow', text: tr('Mã việc 1Office') }); secId.createEl('p', { cls: 'dw-desc mono', text: '#' + t.id }); }
    // actions
    const acts = dw.createEl('div', { cls: 'dw-actions' });
    const mk = (cls, ic, lab, fn) => { const b = acts.createEl('button', { cls: 'act ' + cls }); b.innerHTML = ic; b.appendText(' ' + lab); b.addEventListener('click', fn); };
    mk('primary', I.check, t.done ? tr('Bỏ xong') : tr('Đánh dấu xong'), () => this.plugin.toggleTask(t));
    mk('', I.copy, tr('Nhân bản'), () => this.plugin.duplicateTask(t));
    mk('', SI.cancel, tr('Huỷ việc'), () => this.plugin.setStatus(t, 'cancel'));
    mk('danger', I.trash, tr('Xoá việc'), () => this.plugin.deleteTask(t));
    this.root.addClass('dw-open');
  }
  closeDrawer() { this.selId = null; if (this.root) this.root.removeClass('dw-open'); if (this.drawerEl) this.drawerEl.empty(); this.render(); }

  // ---------- LIST ----------
  filteredForView() { const tasks = this.allTasks(); return tasks.filter(t => this.fltMatch(t)); }
  fltMatch(t) {
    if (this.fltOwner !== 'all' && !ownersOf(t).includes(this.fltOwner)) return false;
    if (this.fltStatus !== 'all' && this.cardState(t) !== this.fltStatus) return false;
    if (this.fltLate) { const pi = progressInfo(t, today()); if (!pi || (pi.kind !== 'warn' && pi.kind !== 'late')) return false; }
    if (this.fltPeriod === 'all') return true;
    if (this.fltPeriod === 'range') return (!this.fltFrom || (t.date && t.date >= this.fltFrom)) && (!this.fltTo || (t.date && t.date <= this.fltTo));
    if (!t.date) return false;
    if (this.fltPeriod === 'today') return t.date === today();
    if (this.fltPeriod === 'week') { const [a, b] = weekRange(today()); return t.date >= a && t.date <= b; }
    if (this.fltPeriod === 'month') { const [a, b] = monthRange(today()); return t.date >= a && t.date <= b; }
    return true;
  }
  allOwners() { const s = new Set(); this.allTasks().forEach(t => ownersOf(t).forEach(o => s.add(o))); return [...s].sort((a, b) => a.localeCompare(b, 'vi')); }
  renderViewFilter(pane) {
    const bar = pane.createEl('div', { cls: 'pb-vfbar' });
    const os = bar.createEl('select', { cls: 'pb-vfsel' });
    os.createEl('option', { text: tr('Tất cả người'), value: 'all' });
    this.allOwners().forEach(o => os.createEl('option', { text: o, value: o }));
    os.value = this.fltOwner; os.addEventListener('change', () => { this.fltOwner = os.value; this.render(); });
    const ss = bar.createEl('select', { cls: 'pb-vfsel' });
    ss.createEl('option', { text: tr('Mọi trạng thái'), value: 'all' });
    ['doing', 'review', 'error', 'over', 'completed', 'pending', 'notdone', 'fail', 'pause', 'cancel', 'expected', 'closed', 'open'].forEach(k => ss.createEl('option', { text: STATES[k].lab, value: k }));
    ss.value = this.fltStatus; ss.addEventListener('change', () => { this.fltStatus = ss.value; this.render(); });
    const lateBtn = bar.createEl('button', { cls: 'pb-vflate' + (this.fltLate ? ' on' : ''), text: tr('Đang trễ') });
    lateBtn.addEventListener('click', () => { this.fltLate = !this.fltLate; this.render(); });
    const ps = bar.createEl('select', { cls: 'pb-vfsel' });
    [['all', tr('Mọi lúc')], ['today', tr('Hôm nay')], ['week', tr('Tuần này')], ['month', tr('Tháng này')], ['range', tr('Khoảng tùy chọn')]].forEach(([v, l]) => ps.createEl('option', { text: l, value: v }));
    ps.value = this.fltPeriod; ps.addEventListener('change', () => { this.fltPeriod = ps.value; this.render(); });
    if (this.fltPeriod === 'range') {
      const fromI = bar.createEl('input', { cls: 'pb-vfsel pb-vfdate', attr: { type: 'date' } });
      if (this.fltFrom) fromI.value = this.fltFrom;
      fromI.addEventListener('change', () => { this.fltFrom = fromI.value; this.render(); });
      bar.createEl('span', { cls: 'pb-vfarrow', text: '→' });
      const toI = bar.createEl('input', { cls: 'pb-vfsel pb-vfdate', attr: { type: 'date' } });
      if (this.fltTo) toI.value = this.fltTo;
      toI.addEventListener('change', () => { this.fltTo = toI.value; this.render(); });
    }
  }
  // ---------- AGENDA (Nhắc lịch: quá hạn / hôm nay / sắp tới) ----------
  renderAgenda(main) {
    const pane = main.createEl('div', { cls: 'pb-viewpane' });
    pane.createEl('div', { cls: 'pb-vh', text: tr('Nhắc lịch') });
    const tod = today();
    const shift = (iso, d) => { const dt = new Date(iso + 'T00:00:00'); dt.setDate(dt.getDate() + d); return dt.toISOString().slice(0, 10); };
    const soon = shift(tod, 7);
    const endOf = t => t.date || t.startDate || null;
    const open = this.allTasks().filter(t => !t.done && this.cardState(t) !== 'completed');
    const seen = new Set();
    const take = arr => arr.filter(t => { const k = taskKey(t); if (seen.has(k)) return false; seen.add(k); return true; });
    const overdue = take(open.filter(t => endOf(t) && endOf(t) < tod));
    const todayT = take(open.filter(t => { const s = t.startDate || t.date, e = t.date || t.startDate; return e && s <= tod && e >= tod; }));
    const upcoming = take(open.filter(t => { const s = t.startDate || t.date; return s && s > tod && s <= soon; }));
    const groups = [[tr('Quá hạn'), overdue, STATES.over.c], [tr('Hôm nay'), todayT, STATES.doing.c], [tr('Sắp tới (7 ngày)'), upcoming, STATES.pending.c]];
    let any = false;
    groups.forEach(([label, rows, color]) => {
      if (!rows.length) return;
      any = true;
      rows.sort((a, b) => ((endOf(a) || '9999') + (a.s || '')).localeCompare((endOf(b) || '9999') + (b.s || '')));
      const sec = pane.createEl('div', { cls: 'pb-agenda-sec' });
      const h = sec.createEl('div', { cls: 'pb-agenda-h' }); h.style.setProperty('--ac', color);
      h.createEl('span', { cls: 'pb-agenda-dot' }); h.appendText(label + ' · ' + rows.length);
      rows.forEach(t => {
        const st = this.cardState(t), S = STATES[st];
        const row = sec.createEl('div', { cls: 'pb-lrow' }); row.dataset.key = taskKey(t);
        const dot = row.createEl('span', { cls: 'pb-ldot' }); dot.style.background = S.c;
        const ti = row.createEl('span', { cls: 'pb-ltitle' }); if (t.prio === 'high') ti.createEl('span', { cls: 'ev-pri' }); ti.appendText(t.title);
        row.createEl('span', { cls: 'pb-lmeta', text: t.laneName });
        const as = row.createEl('span', { cls: 'pb-lassignee' }); const owners = ownersOf(t); if (owners.length) { avEl(as, owners[0]); as.createEl('span', { cls: 'anm', text: owners[0] + (owners.length > 1 ? ' +' + (owners.length - 1) : '') }); } else as.createEl('span', { cls: 'anm', text: '—' });
        let dtxt = ''; if (t.startDate && t.date && t.startDate !== t.date) dtxt = fmtDate(t.startDate) + '→' + fmtDate(t.date); else if (t.date) dtxt = fmtDate(t.date); else if (t.startDate) dtxt = fmtDate(t.startDate); if (t.s) dtxt += ' ' + t.s;
        row.createEl('span', { cls: 'pb-lmeta', text: dtxt || '—' });
        const chip = row.createEl('span', { cls: 'pb-lchip', text: tr(S.lab) }); chip.style.color = S.c; chip.style.background = 'color-mix(in srgb,' + S.c + ' 15%,transparent)';
        row.addEventListener('click', () => this.openCard(t));
      });
    });
    if (!any) pane.createEl('div', { cls: 'pb-empty', text: tr('Không có việc quá hạn, hôm nay hay sắp tới.') });
  }

  renderList(main) {
    const pane = main.createEl('div', { cls: 'pb-viewpane' });
    pane.createEl('div', { cls: 'pb-vh', text: tr('Danh sách công việc') });
    this.renderViewFilter(pane);
    const rows = this.filteredForView().slice().sort((a, b) => ((a.date || '9999') + (a.s || '')).localeCompare((b.date || '9999') + (b.s || '')));
    const head = pane.createEl('div', { cls: 'pb-lhead' });
    ['', tr('Việc'), tr('Lane'), tr('Người'), tr('Hạn'), tr('Tiến độ'), tr('Trạng thái')].forEach(h => head.createEl('span', { text: h }));
    const lst = pane.createEl('div', { cls: 'pb-lst' });
    rows.forEach(t => {
      const st = this.cardState(t), S = STATES[st];
      const row = lst.createEl('div', { cls: 'pb-lrow' + (t.done ? ' done-row' : '') }); row.dataset.key = taskKey(t);
      const dot = row.createEl('span', { cls: 'pb-ldot' }); dot.style.background = S.c;
      const ti = row.createEl('span', { cls: 'pb-ltitle' }); if (t.pri && !t.done) ti.createEl('span', { cls: 'ev-pri' }); ti.appendText(t.title);
      row.createEl('span', { cls: 'pb-lmeta', text: t.laneName });
      const as = row.createEl('span', { cls: 'pb-lassignee' }); const owners = ownersOf(t); if (owners.length) { avEl(as, owners[0]); as.createEl('span', { cls: 'anm', text: owners[0] + (owners.length > 1 ? ' +' + (owners.length - 1) : '') }); } else as.createEl('span', { cls: 'anm', text: '—' });
      row.createEl('span', { cls: 'pb-lmeta', text: (t.date ? fmtDate(t.date) : '—') + (t.s ? ' ' + t.s : '') });
      const pgc = row.createEl('span', { cls: 'pb-lprog' }); const lpi = progressInfo(t, today());
      if (lpi) { const tk = pgc.createEl('div', { cls: 'ev-prog-track' }); const fl = tk.createEl('div', { cls: 'ev-prog-fill' }); fl.style.width = lpi.actual + '%'; fl.style.background = lpi.color; if (lpi.expected != null) { const mk = tk.createEl('div', { cls: 'ev-prog-exp' }); mk.style.left = lpi.expected + '%'; } const lb = pgc.createEl('span', { cls: 'pb-lprog-lb', text: lpi.actual + '%' }); lb.style.color = lpi.color; }
      else pgc.createEl('span', { cls: 'anm', text: '—' });
      const chip = row.createEl('span', { cls: 'pb-lchip', text: tr(S.lab) }); chip.style.color = S.c; chip.style.background = 'color-mix(in srgb,' + S.c + ' 15%,transparent)';
      row.addEventListener('click', () => this.openCard(t));
    });
    if (!rows.length) pane.createEl('div', { cls: 'pb-empty', text: tr('Không có việc khớp bộ lọc.') });
  }

  // ---------- CALENDAR ----------
  renderCalendar(main) {
    const pane = main.createEl('div', { cls: 'pb-viewpane' });
    const p = this.calAnchor.split('-'); const y = +p[0], mo = +p[1];
    const monthName = tr('Tháng ') + mo + '/' + y;
    const vh = pane.createEl('div', { cls: 'pb-vh' }); vh.setText(tr('Lịch — ') + monthName);
    const nav = pane.createEl('div', { cls: 'pb-vfbar' });
    const prev = nav.createEl('button', { cls: 'pb-vfnav' }); prev.innerHTML = I.chevL; prev.addEventListener('click', () => { let m = mo - 1, yy = y; if (m < 1) { m = 12; yy--; } this.calAnchor = yy + '-' + String(m).padStart(2, '0') + '-01'; this.render(); });
    const tdb = nav.createEl('button', { cls: 'pb-vftoday', text: tr('Hôm nay') }); tdb.addEventListener('click', () => { this.calAnchor = today().slice(0, 7) + '-01'; this.render(); });
    const next = nav.createEl('button', { cls: 'pb-vfnav' }); next.innerHTML = I.chevR; next.addEventListener('click', () => { let m = mo + 1, yy = y; if (m > 12) { m = 1; yy++; } this.calAnchor = yy + '-' + String(m).padStart(2, '0') + '-01'; this.render(); });
    const grid = pane.createEl('div', { cls: 'pb-calgrid' });
    ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].forEach(d => grid.createEl('div', { cls: 'pb-caldow', text: d }));
    const first = new Date(y, mo - 1, 1); const lead = (first.getDay() + 6) % 7; const dim = new Date(y, mo, 0).getDate();
    const tasks = this.allTasks();
    for (let i = 0; i < lead; i++) grid.createEl('div', { cls: 'pb-calcell out' });
    for (let d = 1; d <= dim; d++) {
      const ds = y + '-' + String(mo).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      const cell = grid.createEl('div', { cls: 'pb-calcell' + (ds === today() ? ' today' : '') });
      cell.createEl('div', { cls: 'pb-caldate', text: String(d) });
      const dayTasks = tasks.filter(t => t.date === ds);
      dayTasks.slice(0, 3).forEach(t => { const st = this.cardState(t), S = STATES[st]; const pill = cell.createEl('div', { cls: 'pb-calpill', text: t.title }); pill.style.background = S.c; pill.addEventListener('click', () => this.openCard(t)); });
      if (dayTasks.length > 3) cell.createEl('div', { cls: 'pb-calmore', text: '+' + (dayTasks.length - 3) + tr(' nữa') });
    }
  }

  // ---------- DASHBOARD ----------
  renderDashboard(main) {
    const pane = main.createEl('div', { cls: 'pb-viewpane' });
    pane.createEl('div', { cls: 'pb-vh', text: tr('Thống kê') });
    this.renderViewFilter(pane);
    const tasks = this.filteredForView();
    const tot=tasks.length, doing=tasks.filter(t=>t.status==='doing'&&!t.over&&!t.done).length, over=tasks.filter(t=>t.over).length, done=tasks.filter(t=>t.done||t.status==='completed').length;
    const grid = pane.createEl('div', { cls: 'pb-dgrid' });
    [['Tổng việc', tot, '#4F7BA3'], ['Đang làm', doing, '#2F6DB0'], ['Quá hạn', over, '#C0392B'], ['Hoàn thành', done, '#2E8B6B']].forEach(([l, n, c]) => { const card = grid.createEl('div', { cls: 'pb-dcard' }); card.style.setProperty('--kc', c); card.createEl('div', { cls: 'dn', text: String(n) }); card.createEl('div', { cls: 'dl', text: l }); });
    const panels = pane.createEl('div', { cls: 'pb-dpanels' });
    // by lane
    const byLane = {}; tasks.forEach(t => byLane[t.laneName] = (byLane[t.laneName] || 0) + 1);
    this.barsPanel(panels, 'Theo lane', Object.entries(byLane).sort((a, b) => b[1] - a[1]), (k, i) => TONE[LANE_TONES[i % LANE_TONES.length]]);
    // by person
    const byP = {}; tasks.forEach(t => ownersOf(t).forEach(o => byP[o] = (byP[o] || 0) + 1));
    this.barsPanel(panels, tr('Khối lượng theo người'), Object.entries(byP).sort((a, b) => b[1] - a[1]).slice(0, 8), k => TONE[ownerTone(k)]);
    // upcoming/overdue
    const wide = pane.createEl('div', { cls: 'pb-dpanel wide' }); wide.createEl('h4', { text: tr('Sắp tới & quá hạn') });
    tasks.filter(t => !t.done).sort((a, b) => (a.over === b.over ? 0 : a.over ? -1 : 1) || ((a.date || '9999').localeCompare(b.date || '9999'))).slice(0, 8).forEach(t => {
      const st = this.cardState(t), S = STATES[st]; const row = wide.createEl('div', { cls: 'pb-mlrow' }); const dot = row.createEl('span', { cls: 'pb-ldot' }); dot.style.background = S.c;
      row.createEl('span', { cls: 'mltitle', text: t.title }); const dl = row.createEl('span', { cls: 'mldate', text: t.over ? tr('Quá hạn') : (t.date ? fmtDate(t.date) : '—') }); dl.style.color = t.over ? '#C0392B' : 'var(--text-muted)';
      row.addEventListener('click', () => this.openCard(t));
    });
  }
  barsPanel(parent, title, entries, colorFn) {
    const panel = parent.createEl('div', { cls: 'pb-dpanel' }); panel.createEl('h4', { text: title });
    const max = Math.max(1, ...entries.map(e => e[1]));
    entries.forEach(([k, v], i) => { const row = panel.createEl('div', { cls: 'pb-bar-row' }); row.createEl('span', { cls: 'bl', text: k }); const track = row.createEl('div', { cls: 'pb-bar-track' }); const fill = track.createEl('div', { cls: 'pb-bar-fill' }); fill.style.width = (v / max * 100) + '%'; fill.style.background = colorFn(k, i); row.createEl('span', { cls: 'bv', text: String(v) }); });
    if (!entries.length) panel.createEl('div', { cls: 'pb-col-empty', text: tr('Không có dữ liệu') });
  }
}

// ---------- demo view ----------
class PieDemoView extends obsidian.ItemView {
  constructor(leaf, plugin) { super(leaf); this.plugin = plugin; }
  getViewType() { return DEMO_VIEW; }
  getDisplayText() { return 'Pie Tasks — Demo'; }
  getIcon() { return 'layout-dashboard'; }
  async onOpen() { this.render(); }
  render() {
    const c = this.containerEl.children[1]; c.empty(); c.style.padding = '0'; c.style.overflow = 'hidden';
    const file = DEMO_FILES[this.plugin.demoFile] || DEMO_FILES.planner;
    const iframe = c.createEl('iframe'); iframe.style.width = '100%'; iframe.style.height = '100%'; iframe.style.border = 'none'; iframe.style.display = 'block';
    const path = obsidian.normalizePath(this.plugin.manifest.dir + '/' + file);
    iframe.setAttribute('src', this.app.vault.adapter.getResourcePath(path));
  }
}

// ---------- prompt/confirm modal (Electron chặn window.prompt) ----------
class StepEditModal extends obsidian.Modal {
  constructor(app, plugin, text, owner, onSubmit) { super(app); this.plugin = plugin; this.text0 = text || ''; this.owner = owner || null; this.onSubmit = onSubmit; }
  onOpen() {
    const { contentEl, titleEl } = this;
    titleEl.setText(tr('Sửa việc con'));
    const inp = contentEl.createEl('input', { attr: { type: 'text' } });
    inp.style.cssText = 'width:100%;margin-top:8px;'; inp.value = this.text0;
    // hàng người phụ trách
    contentEl.createEl('div', { text: tr('Người phụ trách'), attr: { style: 'font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;opacity:.6;margin:14px 0 6px;' } });
    const row = contentEl.createEl('div', { attr: { style: 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;' } });
    const box = row.createEl('div', { attr: { style: 'display:flex;align-items:center;gap:8px;min-width:120px;' } });
    const renderOwner = () => {
      box.empty();
      if (this.owner) { avEl(box, this.owner.name, 'ci-av'); box.createEl('span', { text: this.owner.name, attr: { style: 'font-size:13px;' } }); }
      else { const ic = box.createEl('span', { attr: { style: 'display:inline-flex;align-items:center;opacity:.55;' } }); ic.innerHTML = I.person; const s = ic.querySelector('svg'); if (s) { s.style.width = '18px'; s.style.height = '18px'; } box.createEl('span', { text: tr('Chưa gán'), attr: { style: 'font-size:13px;opacity:.5;' } }); }
    };
    renderOwner();
    const pick = row.createEl('button', { attr: { type: 'button', title: tr('Gán / Đổi người') } });
    pick.innerHTML = I.userPlus; pick.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;padding:6px 9px;';
    { const s = pick.querySelector('svg'); if (s) { s.style.width = '17px'; s.style.height = '17px'; } }
    pick.addEventListener('click', async () => {
      const people = await this.plugin.loadPeople();
      if (!people.length) { const nm = ((await askText(this.app, 'Người phụ trách việc con')) || '').trim(); if (nm) { this.owner = { name: nm, kind: 'human' }; renderOwner(); } return; }
      new PeoplePickerModal(this.app, people, async p => { if (p._new) await this.plugin.addPersonToFile(p.name); this.owner = { name: p.name, kind: p.kind === 'ai' ? 'ai' : 'human' }; renderOwner(); }).open();
    });
    const clr = row.createEl('button', { attr: { type: 'button', title: tr('Gỡ người'), 'aria-label': tr('Gỡ người') } });
    clr.innerHTML = I.x; clr.style.cssText = 'color:#E5484D;display:inline-flex;align-items:center;justify-content:center;padding:6px 8px;';
    { const s = clr.querySelector('svg'); if (s) { s.style.width = '16px'; s.style.height = '16px'; } }
    clr.addEventListener('click', () => { this.owner = null; renderOwner(); });
    const btns = contentEl.createDiv({ attr: { style: 'display:flex;gap:8px;justify-content:flex-end;margin-top:18px;' } });
    btns.createEl('button', { text: tr('Huỷ'), attr: { type: 'button' } }).addEventListener('click', () => this.close());
    const submit = () => { const v = inp.value.trim(); this.done = true; this.close(); this.onSubmit(v, this.owner); };
    btns.createEl('button', { text: 'OK', cls: 'mod-cta', attr: { type: 'button' } }).addEventListener('click', submit);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
    window.setTimeout(() => { inp.focus(); inp.select(); }, 0);
  }
  onClose() { this.contentEl.empty(); }
}
class PromptModal extends obsidian.Modal {
  constructor(app, opts, resolve) { super(app); this.opts = opts; this.resolve = resolve; this.done = false; }
  onOpen() {
    const { contentEl, titleEl } = this;
    titleEl.setText(this.opts.title || '');
    if (this.opts.message) contentEl.createEl('p', { text: this.opts.message, attr: { style: 'margin:0 0 6px;line-height:1.5;' } });
    if (this.opts.type !== 'confirm') {
      const inp = contentEl.createEl('input', { attr: { type: 'text' } });
      inp.style.cssText = 'width:100%;margin-top:8px;';
      inp.value = this.opts.value || '';
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); this.submit(inp.value); } });
      this.inp = inp;
      window.setTimeout(() => { inp.focus(); inp.select(); }, 0);
    }
    const btns = contentEl.createDiv({ attr: { style: 'display:flex;gap:8px;justify-content:flex-end;margin-top:16px;' } });
    btns.createEl('button', { text: tr('Huỷ') }).addEventListener('click', () => this.close());
    btns.createEl('button', { text: this.opts.okText || 'OK', cls: 'mod-cta' }).addEventListener('click', () => this.submit(this.inp ? this.inp.value : true));
  }
  submit(v) { this.done = true; this.resolve(this.opts.type === 'confirm' ? true : (typeof v === 'string' ? v.trim() : v)); this.close(); }
  onClose() { this.contentEl.empty(); if (!this.done) this.resolve(this.opts.type === 'confirm' ? false : null); }
}
function askText(app, title, value) { return new Promise(res => new PromptModal(app, { title, value, type: 'text' }, res).open()); }
function askConfirm(app, message, title) { return new Promise(res => new PromptModal(app, { title: title || tr('Xác nhận'), message, type: 'confirm', okText: tr('Đồng ý') }, res).open()); }

// ---------- modal thêm/sửa lane: nhập tên + chọn icon ----------
class LaneModal extends obsidian.Modal {
  constructor(app, opts, resolve) { super(app); this.opts = opts; this.resolve = resolve; this.done = false; this.icon = opts.emoji || ''; this.color = opts.color || ''; }
  onOpen() {
    const { contentEl, titleEl } = this;
    titleEl.setText(this.opts.title || 'Lane');
    contentEl.createEl('div', { text: tr('Tên lane'), attr: { style: 'font-size:12px;opacity:.7;margin-bottom:4px;' } });
    const inp = contentEl.createEl('input', { attr: { type: 'text', placeholder: 'vd: Đang chờ duyệt' } });
    inp.style.cssText = 'width:100%;margin-bottom:15px;';
    inp.value = this.opts.name || '';
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); this.submit(inp.value); } });
    this.inp = inp;
    contentEl.createEl('div', { text: 'Icon', attr: { style: 'font-size:12px;opacity:.7;margin-bottom:6px;' } });
    const grid = contentEl.createDiv({ cls: 'pt-iconpick' });
    this._btns = []; this._chips = [];
    const auto = grid.createEl('button', { cls: 'pt-iconbtn', attr: { title: tr('Tự động theo tên lane'), type: 'button' } });
    auto.createEl('span', { cls: 'pt-iconchip auto', text: tr('Tự') }); auto.dataset.emoji = '';
    auto.addEventListener('click', () => { this.icon = ''; this._sync(); });
    this._btns.push(auto);
    LANE_ICONS.forEach(it => {
      const b = grid.createEl('button', { cls: 'pt-iconbtn', attr: { title: it.label, type: 'button' } });
      const chip = b.createEl('span', { cls: 'pt-iconchip' }); chip.innerHTML = I[it.key] || I.list;
      b.dataset.emoji = it.emoji; this._chips.push(chip);
      b.addEventListener('click', () => { this.icon = it.emoji; this._sync(); });
      this._btns.push(b);
    });
    contentEl.createEl('div', { text: tr('Màu'), attr: { style: 'font-size:12px;opacity:.7;margin:14px 0 6px;' } });
    const crow = contentEl.createDiv({ cls: 'pt-colorpick' });
    this._sw = [];
    const cAuto = crow.createEl('button', { cls: 'pt-swatch auto', text: tr('Tự'), attr: { title: tr('Màu tự động theo vị trí lane'), type: 'button' } });
    cAuto.dataset.color = '';
    cAuto.addEventListener('click', () => { this.color = ''; this._sync(); });
    this._sw.push(cAuto);
    LANE_COLORS.forEach(hex => {
      const s = crow.createEl('button', { cls: 'pt-swatch', attr: { title: hex, type: 'button' } });
      s.style.background = hex; s.dataset.color = hex;
      s.addEventListener('click', () => { this.color = hex; this._sync(); });
      this._sw.push(s);
    });
    this._sync();
    const btns = contentEl.createDiv({ attr: { style: 'display:flex;gap:8px;justify-content:flex-end;margin-top:18px;' } });
    btns.createEl('button', { text: tr('Huỷ'), attr: { type: 'button' } }).addEventListener('click', () => this.close());
    btns.createEl('button', { text: this.opts.okText || 'OK', cls: 'mod-cta', attr: { type: 'button' } }).addEventListener('click', () => this.submit(this.inp.value));
    window.setTimeout(() => { inp.focus(); inp.select(); }, 0);
  }
  _sync() {
    this._btns.forEach(b => b.toggleClass('on', b.dataset.emoji === this.icon));
    this._sw.forEach(s => s.toggleClass('on', s.dataset.color === this.color));
    const c = this.color || '#2F6DB0';
    this._chips.forEach(ch => { ch.style.background = c; });
  }
  submit(v) { const name = (v || '').trim(); if (!name) { this.inp.focus(); return; } this.done = true; this.resolve({ name, emoji: this.icon, color: this.color }); this.close(); }
  onClose() { this.contentEl.empty(); if (!this.done) this.resolve(null); }
}
function askLane(app, opts) { return new Promise(res => new LaneModal(app, opts, res).open()); }

// ---------- picker chọn người phụ trách từ file nhân sự ----------
class PeoplePickerModal extends obsidian.SuggestModal {
  constructor(app, people, onChoose) { super(app); this.people = people; this.onChoose = onChoose; this.setPlaceholder(tr('Gõ để tìm / thêm người phụ trách…')); }
  getSuggestions(q) {
    const s = q.trim().toLowerCase();
    const list = this.people.filter(p => p.name.toLowerCase().includes(s));
    if (s && !this.people.some(p => p.name.toLowerCase() === s)) list.push({ name: q.trim(), id: null, _new: true });
    return list;
  }
  renderSuggestion(p, el) {
    if (p._new) { el.createEl('div', { text: tr('➕ Thêm "') + p.name + '" (người mới)' }); return; }
    el.createEl('div', { text: p.name });
    if (p.kind === 'ai') el.createEl('small', { text: 'AI', attr: { style: 'opacity:.55; margin-left:6px;' } });
    else if (p.id) el.createEl('small', { text: '1Office #' + p.id, attr: { style: 'opacity:.55; margin-left:6px;' } });
  }
  onChooseSuggestion(p) { this.onChoose(p); }
}

// ---------- picker chọn note/file trong vault để gắn vào task ----------
class FileSuggestModal extends obsidian.SuggestModal {
  constructor(app, onChoose) { super(app); this.onChoose = onChoose; this.setPlaceholder(tr('Gõ để tìm note / file trong vault…')); }
  getSuggestions(q) {
    const s = q.trim().toLowerCase();
    const files = this.app.vault.getFiles();
    const list = s ? files.filter(f => f.path.toLowerCase().includes(s)) : files;
    return list.slice(0, 50);
  }
  renderSuggestion(f, el) {
    el.createEl('div', { text: f.basename });
    el.createEl('small', { text: f.path, attr: { style: 'opacity:.5; display:block;' } });
  }
  onChooseSuggestion(f) { this.onChoose(f); }
}

class ProjectSuggestModal extends obsidian.SuggestModal {
  constructor(app, onChoose) { super(app); this.onChoose = onChoose; this.setPlaceholder(tr('Chọn dự án (note có subtype / type: project)…')); }
  _projects() {
    const mc = this.app.metadataCache;
    return this.app.vault.getMarkdownFiles().filter(f => {
      const fm = (mc.getFileCache(f) || {}).frontmatter;
      return fm && (fm.subtype === 'project' || fm.type === 'project');
    });
  }
  getSuggestions(q) {
    const s = q.trim().toLowerCase();
    const PDIR = '3.PROCESS/02.PROJECTS';
    const rank = f => (f.path.startsWith(PDIR) ? 0 : 1);
    const list = this._projects()
      .filter(f => !s || (f.basename + ' ' + f.path).toLowerCase().includes(s))
      .sort((a, b) => rank(a) - rank(b) || a.basename.localeCompare(b.basename));
    return list.slice(0, 50);
  }
  renderSuggestion(f, el) {
    const fm = (this.app.metadataCache.getFileCache(f) || {}).frontmatter || {};
    el.createEl('div', { text: fm.project_name || f.basename });
    el.createEl('small', { text: f.path, attr: { style: 'opacity:.5; display:block;' } });
  }
  onChooseSuggestion(f) { this.onChoose(f); }
}

// ---------- modal thêm/sửa bảng (profile): tên + icon + màu + đường dẫn file ----------
class ProfileModal extends obsidian.Modal {
  constructor(app, opts, resolve) { super(app); this.opts = opts; this.resolve = resolve; this.done = false; this.color = opts.color || '#2F6DB0'; this.iconType = opts.iconType || 'letter'; this.icon = opts.icon || ''; }
  _fileRow(label, val, ph) {
    const { contentEl } = this;
    contentEl.createEl('div', { text: label, attr: { style: 'font-size:12px;opacity:.7;margin:12px 0 4px;' } });
    const row = contentEl.createDiv({ attr: { style: 'display:flex;gap:6px;' } });
    const inp = row.createEl('input', { attr: { type: 'text', placeholder: ph } });
    inp.style.cssText = 'flex:1;'; inp.value = val || '';
    const br = row.createEl('button', { text: tr('Chọn…'), attr: { type: 'button' } });
    br.addEventListener('click', () => new FileSuggestModal(this.app, f => { inp.value = f.path; }).open());
    return inp;
  }
  onOpen() {
    const { contentEl, titleEl } = this;
    titleEl.setText(this.opts.title || tr('Bảng'));
    contentEl.createEl('div', { text: tr('Tên bảng'), attr: { style: 'font-size:12px;opacity:.7;margin-bottom:4px;' } });
    const nameRow = contentEl.createDiv({ attr: { style: 'display:flex;gap:10px;align-items:center;margin-bottom:6px;' } });
    const prev = nameRow.createEl('span', { cls: 'pb-brand pb-profchip', attr: { title: tr('Xem trước') } }); prev.style.margin = '0'; prev.style.flex = '0 0 auto';
    const inp = nameRow.createEl('input', { attr: { type: 'text', placeholder: tr('vd: Dự án Website') } });
    inp.style.cssText = 'flex:1;'; inp.value = this.opts.name || '';
    this.inp = inp;
    const updPrev = () => paintProfChip(prev, { name: inp.value, color: this.color, iconType: this.iconType, icon: this.icon }, this.app);
    inp.addEventListener('input', updPrev);

    contentEl.createEl('div', { text: tr('Biểu tượng (để trống = chữ cái đầu tên)'), attr: { style: 'font-size:12px;opacity:.7;margin:14px 0 6px;' } });
    const irow = contentEl.createDiv({ cls: 'pt-iconpick' });
    this._iconBtns = [];
    const letBtn = irow.createEl('button', { cls: 'pt-iconbtn', attr: { title: tr('Chữ cái đầu tên'), type: 'button' } });
    letBtn.createEl('span', { cls: 'pt-iconchip pt-iconletter', text: 'Aa' });
    letBtn.addEventListener('click', () => { this.iconType = 'letter'; this.icon = ''; this._syncIcon(); updPrev(); });
    this._iconBtns.push({ el: letBtn, is: () => this.iconType === 'letter' });
    LANE_ICONS.forEach(it => {
      const b = irow.createEl('button', { cls: 'pt-iconbtn', attr: { title: it.label, type: 'button' } });
      b.createEl('span', { cls: 'pt-iconchip' }).innerHTML = I[it.key] || I.list;
      b.addEventListener('click', () => { this.iconType = 'icon'; this.icon = it.key; this._syncIcon(); updPrev(); });
      this._iconBtns.push({ el: b, is: () => this.iconType === 'icon' && this.icon === it.key });
    });
    const imgRow = contentEl.createDiv({ attr: { style: 'display:flex;gap:6px;margin-top:8px;' } });
    const pickImg = imgRow.createEl('button', { cls: 'pt-imgbtn', attr: { type: 'button' } });
    pickImg.innerHTML = I.image; pickImg.appendText(tr(' Chọn ảnh từ vault…'));
    pickImg.addEventListener('click', () => new FileSuggestModal(this.app, f => {
        if (IMG_RE.test(f.path)) { this.iconType = 'image'; this.icon = f.path; this._syncIcon(); updPrev(); }
        else new obsidian.Notice(tr('Hãy chọn file ảnh (png/jpg/webp/svg…).'));
      }).open());
    imgRow.createEl('button', { text: tr('Bỏ ảnh'), attr: { type: 'button' } })
      .addEventListener('click', () => { if (this.iconType === 'image') { this.iconType = 'letter'; this.icon = ''; this._syncIcon(); updPrev(); } });

    contentEl.createEl('div', { text: tr('Màu nền'), attr: { style: 'font-size:12px;opacity:.7;margin:14px 0 6px;' } });
    const crow = contentEl.createDiv({ cls: 'pt-colorpick' });
    this._sw = [];
    LANE_COLORS.forEach(hex => {
      const s = crow.createEl('button', { cls: 'pt-swatch', attr: { title: hex, type: 'button' } });
      s.style.background = hex; s.dataset.color = hex;
      s.addEventListener('click', () => { this.color = hex; this._sync(); updPrev(); });
      this._sw.push(s);
    });
    this.tp = this._fileRow(tr('File công việc (bắt buộc)'), this.opts.taskPath || '', tr('vd: PROJECTS/task1.md'));
    this.pp = this._fileRow(tr('File nhân sự (tuỳ chọn — để trống dùng mặc định chung)'), this.opts.peoplePath || '', tr('vd: People.md'));
    this._sync(); this._syncIcon(); updPrev();
    const btns = contentEl.createDiv({ attr: { style: 'display:flex;gap:8px;justify-content:flex-end;margin-top:18px;' } });
    btns.createEl('button', { text: tr('Huỷ'), attr: { type: 'button' } }).addEventListener('click', () => this.close());
    btns.createEl('button', { text: this.opts.okText || 'OK', cls: 'mod-cta', attr: { type: 'button' } }).addEventListener('click', () => this.submit());
    window.setTimeout(() => { inp.focus(); inp.select(); }, 0);
  }
  _sync() { this._sw.forEach(s => s.toggleClass('on', s.dataset.color === this.color)); }
  _syncIcon() { this._iconBtns.forEach(o => o.el.toggleClass('on', o.is())); }
  submit() {
    const taskPath = (this.tp.value || '').trim();
    if (!taskPath) { this.tp.focus(); return; }
    this.done = true;
    this.resolve({ name: (this.inp.value || '').trim(), iconType: this.iconType, icon: this.icon, color: this.color, taskPath, peoplePath: (this.pp.value || '').trim() });
    this.close();
  }
  onClose() { this.contentEl.empty(); if (!this.done) this.resolve(null); }
}
function askProfile(app, opts) { return new Promise(res => new ProfileModal(app, opts, res).open()); }

// ---------- modal quản lý danh sách bảng (sửa/xoá/đổi thứ tự) ----------
class ProfileManagerModal extends obsidian.Modal {
  constructor(app, plugin) { super(app); this.plugin = plugin; }
  onOpen() { this.titleEl.setText(tr('Quản lý bảng')); this.render(); }
  render() {
    const c = this.contentEl; c.empty(); c.addClass('pt-mgr');
    const list = c.createDiv({ cls: 'pt-plist' });
    const profs = this.plugin.settings.profiles;
    profs.forEach((p, i) => {
      const row = list.createDiv({ cls: 'pt-prow' });
      const sw = row.createEl('span', { cls: 'pb-prof-sw' }); paintProfChip(sw, p, this.plugin.app);
      const info = row.createDiv({ cls: 'pt-pinfo' });
      info.createEl('div', { cls: 'pt-pname', text: p.name + (p.id === this.plugin.settings.activeId ? tr(' · đang mở') : '') });
      info.createEl('small', { text: p.taskPath, attr: { style: 'opacity:.55;' } });
      const acts = row.createDiv({ cls: 'pt-pacts' });
      const up = acts.createEl('button', { text: '↑', attr: { type: 'button', title: tr('Lên') } }); up.disabled = i === 0;
      up.addEventListener('click', async () => { await this.plugin.moveProfile(p.id, -1); this.render(); });
      const dn = acts.createEl('button', { text: '↓', attr: { type: 'button', title: tr('Xuống') } }); dn.disabled = i === profs.length - 1;
      dn.addEventListener('click', async () => { await this.plugin.moveProfile(p.id, 1); this.render(); });
      acts.createEl('button', { text: tr('Sửa'), attr: { type: 'button' } }).addEventListener('click', async () => { await this.plugin.editProfile(p.id); this.render(); });
      acts.createEl('button', { text: tr('Xoá'), cls: 'danger', attr: { type: 'button' } }).addEventListener('click', async () => { await this.plugin.deleteProfile(p.id); this.render(); });
    });
    const add = c.createEl('button', { text: tr('＋ Thêm bảng'), cls: 'mod-cta', attr: { type: 'button', style: 'margin-top:14px;' } });
    add.addEventListener('click', async () => { await this.plugin.addProfile(); this.render(); });
  }
  onClose() { this.contentEl.empty(); }
}

function newId() { return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function makeProfile(o) {
  return Object.assign({
    id: newId(), name: tr('Bảng chính'),
    iconType: 'letter',  // 'letter' (chữ cái đầu) | 'icon' (SVG bộ có sẵn) | 'image' (ảnh vault)
    icon: '',            // iconType='icon' → key trong I ; iconType='image' → path ảnh trong vault
    color: '#2F6DB0',
    taskPath: 'TASKS.md', peoplePath: '', // '' → fallback defaultPeoplePath / DEFAULT_PEOPLE
    viewState: {}, laneStyles: {}
  }, o || {});
}
const IMG_RE = /\.(png|jpe?g|webp|gif|svg|bmp|avif)$/i;
// Vẽ nội dung chip đại diện bảng: ảnh vault / icon SVG / chữ cái đầu tên
function paintProfChip(el, prof, app) {
  el.empty(); el.removeClass('pb-chip-img');
  const col = (prof.color && prof.color !== '#2F6DB0') ? prof.color : 'var(--interactive-accent)'; // #2F6DB0 cũ / trống → dùng accent của theme
  el.style.background = col;
  el.style.setProperty('--pc', col); // màu khung viền cho chip ảnh
  if (prof.iconType === 'image' && prof.icon && app.vault.getAbstractFileByPath(prof.icon)) {
    el.addClass('pb-chip-img');
    const img = el.createEl('img'); img.src = app.vault.adapter.getResourcePath(prof.icon);
    return;
  }
  if (prof.iconType === 'icon' && I[prof.icon]) { el.innerHTML = I[prof.icon]; return; }
  el.setText(profLetter(prof.name));
}
const DEFAULT_DASH = '3.PROCESS/02.PROJECTS/viec-con-theo-du-an.md';
const DASH_START = '<!-- pie:dashboard:start · vùng tự sinh theo Setting "Phạm vi bảng việc con" — đừng sửa trong vùng này -->';
const DASH_END = '<!-- pie:dashboard:end -->';
const DASH_INTRO = '---\ntitle: Việc con theo dự án\ntype: dashboard\nllm_managed: true\ntags:\n  - dashboard\n  - project\n---\n> [!info] Tổng hợp tự động (Pie Tasks × Dataview)\n> Mọi **task con** gắn field **Dự án** trong Pie Tasks được gom theo từng dự án ở đây — tick được trực tiếp, cập nhật live. Xem **tiến độ tổng** (số việc / %) theo dự án ở bảng `Dashboard Projects.base`. Đổi phạm vi ở Settings → Pie Tasks.\n';
const DEFAULT_PROJECTS_FOLDER = '3.PROCESS/02.PROJECTS';
const DEFAULTS = { profiles: null, activeId: null, defaultPeoplePath: DEFAULT_PEOPLE, taskDashboardScope: 'all', taskDashboardPath: DEFAULT_DASH, projectsFolder: DEFAULT_PROJECTS_FOLDER, stepsOnCard: false, lang: 'vi' };
// Chữ cái đại diện bảng = ký tự chữ/số đầu tiên của tên (như logo 'P' cũ, đẹp hơn emoji)
function profLetter(name) { const m = (name || '').match(/[\p{L}\p{N}]/u); return m ? m[0].toUpperCase() : 'B'; }

class PieTasksPlugin extends obsidian.Plugin {
  async onload() {
    this.settings = Object.assign({}, DEFAULTS, await this.loadData());
    // Tự khôi phục nếu settings rỗng (mất board do cập nhật store ghi vào folder khác id — folder cũ 'pie-task' vs id 'pie-tasks')
    if (!Array.isArray(this.settings.profiles) || !this.settings.profiles.length) await this._recoverLegacyData();
    LANG = this.settings.lang || 'vi';
    this.migrateProfiles();
    this.demoFile = 'planner';
    this.taskData = null; this.taskFile = null;
    this.injectFonts();
    this.registerView(LIVE_VIEW, leaf => new PieLiveView(leaf, this));
    this.registerView(DEMO_VIEW, leaf => new PieDemoView(leaf, this));
    this.addRibbonIcon('checkmark', tr('Pie Tasks (từ file)'), () => this.openLive());
    this.addCommand({ id: 'open-live', name: tr('Mở Pie Tasks — dữ liệu thật từ file'), callback: () => this.openLive() });
    this.addCommand({ id: 'open-demo-planner', name: tr('Mở giao diện mẫu — Day Planner'), callback: () => this.openDemo('planner') });
    this.addCommand({ id: 'open-demo-studio', name: tr('Mở giao diện mẫu — Studio'), callback: () => this.openDemo('studio') });
    this.addCommand({ id: 'reload-tasks', name: tr('Tải lại TASKS.md'), callback: () => this.reload() });
    this.addSettingTab(new PieSettingTab(this.app, this));
    this.registerEvent(this.app.vault.on('modify', f => { if (this.taskFile && f && f.path === this.taskFile.path) this.reload(); }));
    this.registerEvent(this.app.workspace.on('css-change', () => this.refreshLiveViews()));
    // Vault index có thể chưa sẵn sàng lúc onload (nhất là mobile / khi view được khôi phục) → load khi layout ready
    this.app.workspace.onLayoutReady(() => this.reload());
    // Nhắc lịch (a): khi app đang mở, mỗi phút quét task tới giờ bắt đầu/kết thúc → Notice 1 lần/ngày/mốc.
    this.registerInterval(window.setInterval(() => this.checkReminders(), 60000));
  }

  checkReminders() {
    try {
      const data = this.taskData; if (!data || !data.tasks || !data.tasks.length) return;
      const tod = today();
      const now = new Date();
      const hm = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
      if (this._notifDay !== tod) { this._notified = {}; this._notifDay = tod; }
      this._notified = this._notified || {};
      data.tasks.forEach(t => {
        if (t.done) return;
        const key = taskKey(t);
        if ((t.startDate || t.date) === tod && t.s && t.s === hm && !this._notified['s' + key]) { this._notified['s' + key] = 1; new obsidian.Notice(t.title + ' — đến giờ bắt đầu (' + t.s + ')'); }
        if (t.date === tod && t.e && t.e === hm && !this._notified['e' + key]) { this._notified['e' + key] = 1; new obsidian.Notice(t.title + ' — đến giờ kết thúc (' + t.e + ')'); }
      });
    } catch (e) { }
  }

  // ---- Multi-profile: mỗi profile = 1 bảng (file .md riêng, state riêng) ----
  migrateProfiles() {
    const s = this.settings;
    if (Array.isArray(s.profiles) && s.profiles.length) {
      s.profiles = s.profiles.map(p => makeProfile(p)); // backfill field thiếu
      if (!s.profiles.some(p => p.id === s.activeId)) s.activeId = s.profiles[0].id;
      return;
    }
    // Dựng 1 profile từ schema phẳng cũ → user hiện tại thấy y nguyên bảng cũ
    const legacy = makeProfile({
      name: tr('Bảng chính'),
      taskPath: s.taskPath || 'TASKS.md',
      peoplePath: '', // dùng default chung bên dưới
      viewState: s.viewState || {},
      laneStyles: s.laneStyles || {}
    });
    if (s.peoplePath) s.defaultPeoplePath = s.peoplePath; // giữ file nhân sự cũ làm mặc định chung
    s.profiles = [legacy];
    s.activeId = legacy.id;
    delete s.taskPath; delete s.viewState; delete s.laneStyles; delete s.peoplePath;
    this.saveData(this.settings); // persist 1 lần (không await trong onload)
  }
  async _recoverLegacyData() {
    try {
      const cfg = this.app.vault.configDir;
      const here = (this.manifest && this.manifest.dir) ? this.manifest.dir : (cfg + '/plugins/' + this.manifest.id);
      const twins = [cfg + '/plugins/pie-tasks', cfg + '/plugins/pie-task'].filter(d => d !== here);
      for (const d of twins) {
        const p = d + '/data.json';
        if (!(await this.app.vault.adapter.exists(p))) continue;
        let raw; try { raw = JSON.parse(await this.app.vault.adapter.read(p)); } catch (e) { continue; }
        if (raw && Array.isArray(raw.profiles) && raw.profiles.length) {
          this.settings = Object.assign({}, DEFAULTS, raw);
          await this.saveData(this.settings); // ghi vào folder hiện tại → lần sau không cần khôi phục
          new obsidian.Notice('Pie Tasks: đã khôi phục ' + raw.profiles.length + ' bảng từ bản cài trước.');
          return;
        }
      }
    } catch (e) {}
  }
  prof() { const s = this.settings; return s.profiles.find(p => p.id === s.activeId) || s.profiles[0]; }
  peoplePathFor() { const p = this.prof(); return p.peoplePath || this.settings.defaultPeoplePath || DEFAULT_PEOPLE; }
  reseedViews() {
    const vs = this.prof().viewState || {};
    this.app.workspace.getLeavesOfType(LIVE_VIEW).forEach(l => {
      const v = l.view;
      if (v instanceof PieLiveView) {
        v.view = vs.view || 'board'; v.viewMode = vs.viewMode || 'all';
        v.collapsed = new Set(vs.collapsed || []);
        v.selId = null; v.selLane = null; v.filter = 'all';
        v.fltOwner = 'all'; v.fltStatus = 'all'; v.fltPeriod = 'all';
      }
    });
  }
  async switchProfile(id) {
    if (id === this.settings.activeId || !this.settings.profiles.some(p => p.id === id)) return;
    this.settings.activeId = id;
    await this.saveSettings();
    this.reseedViews();
    await this.reload();
  }
  async addProfile() {
    const r = await askProfile(this.app, { title: tr('Thêm bảng'), color: '#2F6DB0', okText: 'Tạo' });
    if (!r || !r.taskPath) return;
    const p = makeProfile({ name: r.name || r.taskPath, iconType: r.iconType, icon: r.icon, color: r.color, taskPath: r.taskPath, peoplePath: r.peoplePath || '' });
    this.settings.profiles.push(p);
    await this.switchProfile(p.id);
  }
  async editProfile(id) {
    const p = this.settings.profiles.find(x => x.id === id); if (!p) return;
    const r = await askProfile(this.app, { title: tr('Sửa bảng'), name: p.name, iconType: p.iconType, icon: p.icon, color: p.color, taskPath: p.taskPath, peoplePath: p.peoplePath, okText: 'Lưu' });
    if (!r || !r.taskPath) return;
    Object.assign(p, { name: r.name || r.taskPath, iconType: r.iconType, icon: r.icon, color: r.color, taskPath: r.taskPath, peoplePath: r.peoplePath || '' });
    await this.saveSettings();
    if (id === this.settings.activeId) await this.reload(); else this.refreshLiveViews();
  }
  async deleteProfile(id) {
    if (this.settings.profiles.length <= 1) { new obsidian.Notice(tr('Phải còn ít nhất 1 bảng.')); return; }
    const p = this.settings.profiles.find(x => x.id === id); if (!p) return;
    if (!(await askConfirm(this.app, tr('Xoá bảng "') + p.name + tr('"? File .md KHÔNG bị xoá, chỉ gỡ khỏi danh sách bảng.')))) return;
    const wasActive = id === this.settings.activeId;
    this.settings.profiles = this.settings.profiles.filter(x => x.id !== id);
    if (wasActive) { this.settings.activeId = this.settings.profiles[0].id; await this.saveSettings(); this.reseedViews(); await this.reload(); }
    else { await this.saveSettings(); this.refreshLiveViews(); }
  }
  async moveProfile(id, dir) {
    const arr = this.settings.profiles, i = arr.findIndex(p => p.id === id), j = i + dir;
    if (i < 0 || j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    await this.saveSettings();
    this.refreshLiveViews();
  }

  injectFonts() {
    if (document.getElementById('pie-tasks-fonts')) return;
    const rules = FONTS.map(([fam, file, weight]) => { const p = obsidian.normalizePath(FONT_DIR + '/' + file); const url = this.app.vault.adapter.getResourcePath(p); return '@font-face{font-family:"' + fam + '";src:url("' + url + '") format("truetype");font-weight:' + weight + ';font-style:normal;font-display:swap;}'; }).join('\n');
    const style = document.createElement('style'); style.id = 'pie-tasks-fonts'; style.textContent = rules; document.head.appendChild(style); this.register(() => style.remove());
  }

  async loadTasks() {
    const path = obsidian.normalizePath(this.prof().taskPath || 'TASKS.md');
    const f = this.app.vault.getAbstractFileByPath(path);
    if (!(f instanceof obsidian.TFile)) { this.taskData = null; this.taskFile = null; return; }
    this.taskFile = f; const md = await this.app.vault.read(f); this.taskData = parseTasks(md, path);
  }
  refreshLiveViews() { this.app.workspace.getLeavesOfType(LIVE_VIEW).forEach(l => { if (l.view instanceof PieLiveView) l.view.render(); }); }
  async reload() { await this.loadTasks(); this.refreshLiveViews(); this.scheduleRollup(); }
  // ---- Rollup task con → frontmatter project note (cho Dashboard Projects.base) ----
  _projectNotes() {
    const mc = this.app.metadataCache;
    return this.app.vault.getMarkdownFiles().filter(f => { const fm = (mc.getFileCache(f) || {}).frontmatter; return fm && (fm.subtype === 'project' || fm.type === 'project'); });
  }
  async _collectProjectCounts() {
    const mc = this.app.metadataCache; const counts = {}; const seen = new Set();
    for (const p of (this.settings.profiles || [])) {
      const path = obsidian.normalizePath(p.taskPath || 'TASKS.md');
      if (seen.has(path)) continue; seen.add(path);
      const f = this.app.vault.getAbstractFileByPath(path);
      if (!(f instanceof obsidian.TFile)) continue;
      let md; try { md = await this.app.vault.read(f); } catch (e) { continue; }
      parseTasks(md, path).tasks.forEach(t => {
        if (!t.project) return;
        const lp = t.project.replace(/^\[\[|\]\]$/g, '').split('|')[0].trim();
        const dest = mc.getFirstLinkpathDest(lp, path);
        if (!dest) return;
        const c = counts[dest.path] || (counts[dest.path] = { total: 0, done: 0, error: 0 });
        c.total++;
        if (t.done || t.status === 'completed') c.done++; else if (t.status === 'error') c.error++;
      });
    }
    return counts;
  }
  // ---- Dashboard "việc con theo dự án" (Dataview) — phạm vi chọn ở Settings ----
  _dashScopeClause() {
    if (this.settings.taskDashboardScope !== 'pie') return ''; // 'all' = toàn vault
    const seen = new Set(); const paths = [];
    for (const p of (this.settings.profiles || [])) { const pt = obsidian.normalizePath(p.taskPath || 'TASKS.md'); if (!seen.has(pt)) { seen.add(pt); paths.push(pt); } }
    if (!paths.length) return '';
    return 'FROM ' + paths.map(p => '"' + p + '"').join(' OR ') + '\n';
  }
  _dashRegion() {
    const scope = this._dashScopeClause();
    return DASH_START + '\n'
      + '## Tất cả việc con theo dự án\n'
      + '```dataview\nTASK\n' + scope + 'WHERE project\nGROUP BY project AS "Dự án"\n```\n\n'
      + '## Chỉ việc chưa xong\n'
      + '```dataview\nTASK\n' + scope + 'WHERE project AND !completed\nGROUP BY project AS "Dự án"\n```\n'
      + DASH_END;
  }
  async writeTaskDashboard() {
    const path = obsidian.normalizePath(this.settings.taskDashboardPath || DEFAULT_DASH);
    const region = this._dashRegion();
    const f = this.app.vault.getAbstractFileByPath(path);
    if (!(f instanceof obsidian.TFile)) { try { await this.app.vault.create(path, DASH_INTRO + '\n' + region + '\n'); } catch (e) {} return; }
    const md = await this.app.vault.read(f);
    const si = md.indexOf(DASH_START), ei = md.indexOf(DASH_END);
    let nw;
    if (si !== -1 && ei !== -1 && ei > si) nw = md.slice(0, si) + region + md.slice(ei + DASH_END.length);
    else nw = md.replace(/\s*$/, '') + '\n\n' + region + '\n';
    if (nw !== md) await this.app.vault.modify(f, nw);
  }
  // ---- One-click: dựng cả hệ thống (bảng + nhân sự + base dự án + dashboard việc con) ----
  async _sample(name, fallback) { try { return await this.app.vault.adapter.read(obsidian.normalizePath(this.manifest.dir + '/' + name)); } catch (e) { return fallback; } }
  _projectsBaseTemplate(folder) {
    return 'filters:\n  and:\n    - file.inFolder("' + folder + '")\n    - subtype == "project"\n'
      + 'formulas:\n'
      + '  uu_tien: if(priority == "P0", "🔴 P0", if(priority == "P1", "🟠 P1", if(priority == "P2", "🟡 P2", priority)))\n'
      + '  con_lai: if(deadline, (date(deadline) - today()).days, "")\n'
      + '  qua_han: if(deadline, if(date(deadline) < today(), "⚠️ Quá hạn", ""), "")\n'
      + '  viec: if(task_total, task_done + "/" + task_total, "")\n'
      + '  loi_task: if(task_error, task_error, "")\n'
      + 'properties:\n'
      + '  status:\n    displayName: Trạng thái\n'
      + '  formula.viec:\n    displayName: Việc (xong/tổng)\n'
      + '  task_progress:\n    displayName: Tiến độ %\n'
      + '  formula.loi_task:\n    displayName: Task lỗi\n'
      + '  formula.uu_tien:\n    displayName: Ưu tiên\n'
      + '  formula.con_lai:\n    displayName: Còn (ngày)\n'
      + '  formula.qua_han:\n    displayName: Cảnh báo\n'
      + 'views:\n'
      + '  - type: table\n    name: Tất cả Project\n    order:\n'
      + '      - file.name\n      - formula.uu_tien\n      - status\n      - formula.viec\n      - task_progress\n      - formula.loi_task\n      - owner\n      - deadline\n      - formula.con_lai\n      - formula.qua_han\n'
      + '  - type: cards\n    name: Thẻ\n    order:\n      - file.name\n      - formula.uu_tien\n      - status\n      - task_progress\n';
  }
  async setupSystem(projectsFolder) {
    const created = [], skipped = [];
    const ensure = async (path, contentFn) => {
      const norm = obsidian.normalizePath(path);
      if (this.app.vault.getAbstractFileByPath(norm)) { skipped.push(norm); return; }
      const parent = norm.split('/').slice(0, -1).join('/');
      if (parent && !this.app.vault.getAbstractFileByPath(parent)) { try { await this.app.vault.createFolder(parent); } catch (e) {} }
      try { await this.app.vault.create(norm, await contentFn()); created.push(norm); } catch (e) {}
    };
    await ensure(this.prof().taskPath || 'TASKS.md', () => this._sample('TASKS.sample.md', '## 📌 Đang làm\n\n- [ ] **Việc đầu tiên** 📅 ' + today() + ' `Đang làm`\n'));
    await ensure(this.settings.defaultPeoplePath || DEFAULT_PEOPLE, () => this._sample('People.sample.md', '# Nhân sự\n\n| Tên | ID |\n|---|---|\n| Bạn |  |\n'));
    if (projectsFolder) await ensure(obsidian.normalizePath(projectsFolder) + '/Dashboard Projects.base', async () => this._projectsBaseTemplate(obsidian.normalizePath(projectsFolder)));
    const dashPath = obsidian.normalizePath(this.settings.taskDashboardPath || DEFAULT_DASH);
    if (!this.app.vault.getAbstractFileByPath(dashPath)) { await this.writeTaskDashboard(); created.push(dashPath); } else skipped.push(dashPath);
    await this.reload();
    return { created, skipped };
  }
  scheduleRollup() { clearTimeout(this._rollupT); this._rollupT = setTimeout(() => this.syncProjectRollups(), 1000); }
  async syncProjectRollups() {
    if (this._rollupBusy) return; this._rollupBusy = true;
    try {
      const counts = await this._collectProjectCounts();
      for (const f of this._projectNotes()) {
        const fm = (this.app.metadataCache.getFileCache(f) || {}).frontmatter || {};
        const c = counts[f.path]; const had = fm.task_total !== undefined;
        if (!c && !had) continue; // note chưa từng có task con → để nguyên, không đụng
        const cc = c || { total: 0, done: 0, error: 0 };
        const prog = cc.total ? Math.round(cc.done / cc.total * 100) : 0;
        if (fm.task_total === cc.total && fm.task_done === cc.done && fm.task_error === cc.error && fm.task_progress === prog) continue;
        try { await this.app.fileManager.processFrontMatter(f, m => { m.task_total = cc.total; m.task_done = cc.done; m.task_error = cc.error; m.task_progress = prog; }); } catch (e) {}
      }
    } finally { this._rollupBusy = false; }
  }
  async openLive() { await this.loadTasks(); const { workspace } = this.app; let leaf = workspace.getLeavesOfType(LIVE_VIEW)[0]; if (!leaf) { leaf = workspace.getLeaf(true); await leaf.setViewState({ type: LIVE_VIEW, active: true }); } else if (leaf.view instanceof PieLiveView) leaf.view.render(); workspace.revealLeaf(leaf); }
  async openDemo(which) { this.demoFile = which; const { workspace } = this.app; let leaf = workspace.getLeavesOfType(DEMO_VIEW)[0]; if (!leaf) { leaf = workspace.getLeaf(true); await leaf.setViewState({ type: DEMO_VIEW, active: true }); } else if (leaf.view instanceof PieDemoView) leaf.view.render(); workspace.revealLeaf(leaf); }
  async openTaskLine(t) { if (!this.taskFile) return; const leaf = this.app.workspace.getLeaf(true); await leaf.openFile(this.taskFile); const v = leaf.view; if (v && v.editor) { v.editor.setCursor({ line: t.line, ch: 0 }); v.editor.scrollIntoView({ from: { line: t.line, ch: 0 }, to: { line: t.line, ch: 0 } }, true); } }

  // ---- write-back plumbing ----
  async mutate(transform, warn) {
    if (!this.taskFile) return;
    const md = await this.app.vault.read(this.taskFile);
    const nw = transform(md);
    if (nw == null || nw === md) return;
    await this.app.vault.modify(this.taskFile, nw);
    if (warn) new obsidian.Notice(warn);
  }
  syncWarn(t) { return (t && t.synced) ? 'Đã sửa trong file. Lưu ý: task 1Office sẽ bị sync 7:08 ghi đè.' : null; }

  toggleTask(t) { return this.mutate(md => editLineMd(md, taskKey(t), l => toggleDoneRaw(l)), this.syncWarn(t)); }
  setStatus(t, k) { return this.mutate(md => editLineMd(md, taskKey(t), l => setStatusRaw(l, k)), this.syncWarn(t)); }
  setTitle(t, v) { return this.mutate(md => editLineMd(md, taskKey(t), l => setTitleRaw(l, v)), this.syncWarn(t)); }
  setDate(t, v) { return this.mutate(md => editLineMd(md, taskKey(t), l => setDateRaw(l, v)), this.syncWarn(t)); }
  setStartDate(t, v) { return this.mutate(md => editLineMd(md, taskKey(t), l => setStartDateRaw(l, v)), this.syncWarn(t)); }
  setNote(t, v) { return this.mutate(md => editLineMd(md, taskKey(t), l => setNoteRaw(l, v)), this.syncWarn(t)); }
  setEisen(t, code) { return this.mutate(md => editLineMd(md, taskKey(t), l => setEisenRaw(l, code)), this.syncWarn(t)); }
  setTime(t, s, e) { return this.mutate(md => editLineMd(md, taskKey(t), l => setTimeRaw(l, s, e)), this.syncWarn(t)); }
  setPriority(t, level) { return this.mutate(md => editLineMd(md, taskKey(t), l => setPrioRaw(l, level)), this.syncWarn(t)); }
  setPct(t, v) { return this.mutate(md => editLineMd(md, taskKey(t), l => setPctRaw(l, v)), this.syncWarn(t)); }
  toggleCheck(t, i) { return this.mutate(md => toggleCheckMd(md, taskKey(t), i)); }
  async loadPeople() {
    const path = obsidian.normalizePath(this.peoplePathFor());
    const f = this.app.vault.getAbstractFileByPath(path);
    if (!(f instanceof obsidian.TFile)) return [];
    return parsePeopleTable(await this.app.vault.read(f));
  }
  async addPersonToFile(name) {
    const path = obsidian.normalizePath(this.peoplePathFor());
    const f = this.app.vault.getAbstractFileByPath(path);
    if (!(f instanceof obsidian.TFile)) return;
    const md = await this.app.vault.read(f);
    if (/^\|\s*`?\s*(?:👤|🤖)/m.test(md)) return; // danh bạ dạng token (SSOT) — không tự sửa file này
    const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp('^\\|\\s*' + esc + '\\s*\\|', 'm').test(md)) return; // đã có
    const nw = md.replace(/\s*$/, '') + '\n| ' + name + ' | — |  |  | thêm từ Pie Tasks |\n';
    await this.app.vault.modify(f, nw);
  }
  _ownerList(t) { return ownersOf(t).map(n => ({ name: n, kind: (t.owners || []).find(o => o.name === n) ? (t.owners.find(o => o.name === n).kind) : 'human' })); }
  _assignOwner(t, name, kind) { const base = this._ownerList(t); if (!base.some(o => o.name === name)) base.push({ name, kind: kind === 'ai' ? 'ai' : 'human' }); return this.mutate(md => editLineMd(md, taskKey(t), l => setOwnersRaw(l, base)), this.syncWarn(t)); }
  async addMember(t) {
    const people = await this.loadPeople();
    if (!people.length) { const nm = ((await askText(this.app, 'Thêm người phụ trách')) || '').trim(); if (nm) await this._assignOwner(t, nm); return; }
    new PeoplePickerModal(this.app, people, async p => { if (p._new) await this.addPersonToFile(p.name); await this._assignOwner(t, p.name, p.kind); }).open();
  }
  async removeMember(t, name) { const base = this._ownerList(t).filter(o => o.name !== name); await this.mutate(md => editLineMd(md, taskKey(t), l => setOwnersRaw(l, base)), this.syncWarn(t)); }
  async addStep(t) { const s = ((await askText(this.app, 'Thêm bước (việc kế tiếp)')) || '').trim(); if (!s) return; await this.mutate(md => addStepMd(md, taskKey(t), s)); }
  async editStep(t, i, curText, curOwner) {
    new StepEditModal(this.app, this, curText, curOwner || null, async (text, owner) => {
      if (text && text !== curText) await this.mutate(md => editStepMd(md, taskKey(t), i, text), this.syncWarn(t));
      const a = owner ? owner.name + ':' + owner.kind : '';
      const b = curOwner ? curOwner.name + ':' + curOwner.kind : '';
      if (a !== b) await this.mutate(md => setStepOwnerMd(md, taskKey(t), i, owner), this.syncWarn(t));
    }).open();
  }
  deleteStep(t, i) { return this.mutate(md => deleteStepMd(md, taskKey(t), i)); }
  _outNames(t) { return (t.outputs || []).map(o => o.replace(/^\[\[|\]\]$/g, '')); }
  addOutput(t, name) { if (!name) return; const links = [...new Set([...this._outNames(t), name])]; return this.mutate(md => editLineMd(md, taskKey(t), l => setOutputRaw(l, links))); }
  removeOutput(t, name) { const links = this._outNames(t).filter(x => x !== name); return this.mutate(md => editLineMd(md, taskKey(t), l => setOutputRaw(l, links))); }
  attachOutput(t) { const src = this.taskFile ? this.taskFile.path : ''; new FileSuggestModal(this.app, f => this.addOutput(t, this.app.metadataCache.fileToLinktext(f, src, true))).open(); }
  setProject(t, link) { if (!link) return; return this.mutate(md => editLineMd(md, taskKey(t), l => setProjectRaw(l, link))); }
  removeProject(t) { return this.mutate(md => editLineMd(md, taskKey(t), l => setProjectRaw(l, null))); }
  pickProject(t) { const src = this.taskFile ? this.taskFile.path : ''; new ProjectSuggestModal(this.app, f => this.setProject(t, this.app.metadataCache.fileToLinktext(f, src, true))).open(); }
  addTask(laneRaw) { const nm = laneName(laneRaw); this._pendingNew = { lane: laneRaw, title: tr('Việc mới') }; return this.mutate(md => addTaskMd(md, nm, { title: tr('Việc mới'), date: today(), s: '09:00', e: '10:00' }), isSyncedLane(laneRaw) ? 'Đã thêm. Lưu ý: lane 1Office sẽ bị sync ghi đè.' : null); }
  async deleteTask(t) { if (!(await askConfirm(this.app, 'Xoá việc "' + t.title + '"?'))) return; await this.mutate(md => deleteTaskMd(md, taskKey(t)), this.syncWarn(t)); }
  duplicateTask(t) { return this.mutate(md => duplicateTaskMd(md, taskKey(t))); }
  moveTask(key, targetLaneNm) { const t = findTask(this.taskData ? this.taskData.tasks : [], key); return this.mutate(md => moveTaskMd(md, key, targetLaneNm), (t && t.synced) ? 'Đã chuyển. Lưu ý: task 1Office có thể bị sync đưa lại.' : null); }
  moveTaskToPos(key, targetLaneNm, beforeKey) { const t = findTask(this.taskData ? this.taskData.tasks : [], key); return this.mutate(md => moveTaskToPosMd(md, key, targetLaneNm, beforeKey), (t && t.synced) ? 'Đã sắp xếp. Lưu ý: lane 1Office bị sync ghi đè thứ tự.' : null); }
  _laneRaw(nm) { return ((this.taskData && this.taskData.lanes) || []).find(l => laneName(l) === nm) || ''; }
  _laneColor(nm) { const ls = this.prof().laneStyles || {}; return (ls[nm] && ls[nm].color) || ''; }
  async _saveLaneStyle(name, color, oldName) { const p = this.prof(); const ls = p.laneStyles || (p.laneStyles = {}); if (oldName && oldName !== name) delete ls[oldName]; if (color) ls[name] = { color }; else delete ls[name]; await this.saveSettings(); }
  async renameLane(nm) { const cur = laneEmoji(this._laneRaw(nm)); const curColor = this._laneColor(nm); const r = await askLane(this.app, { title: tr('Sửa lane'), name: nm, emoji: cur, color: curColor, okText: 'Lưu' }); if (!r) return; const heading = laneHeading(r.emoji, r.name); if (heading === laneHeading(cur, nm) && r.color === curColor) return; await this._saveLaneStyle(r.name, r.color, nm); await this.mutate(md => renameLaneMd(md, nm, heading)); }
  async addLane() { const r = await askLane(this.app, { title: tr('Thêm lane'), name: '', emoji: '📋', okText: 'Thêm' }); if (!r) return; await this._saveLaneStyle(r.name, r.color); await this.mutate(md => addLaneMd(md, laneHeading(r.emoji, r.name))); }
  async insertLane(refNm, before) { const r = await askLane(this.app, { title: tr('Thêm lane'), name: '', emoji: '📋', okText: 'Thêm' }); if (!r) return; await this._saveLaneStyle(r.name, r.color); await this.mutate(md => addLaneMd(md, laneHeading(r.emoji, r.name), refNm, !before)); }
  async deleteLane(nm) { if (!(await askConfirm(this.app, 'Xoá lane "' + nm + '"? Việc trong lane sẽ dồn sang lane kề.'))) return; await this.mutate(md => deleteLaneMd(md, nm)); }
  moveLane(src, tgt, before) { if (src === tgt) return; return this.mutate(md => moveLaneMd(md, src, tgt, before)); }
  sortLane(nm, mode) { return this.mutate(md => sortLaneMd(md, nm, mode)); }

  async saveSettings() { await this.saveData(this.settings); }
}

class SetupModal extends obsidian.Modal {
  constructor(app, plugin) { super(app); this.plugin = plugin; }
  onOpen() {
    const { contentEl } = this; contentEl.empty(); contentEl.addClass('pt-setup');
    const h = contentEl.createEl('h3', { cls: 'pt-setup-h' }); h.insertAdjacentHTML('afterbegin', I.zap); h.appendText(tr(' Thiết lập hệ thống quản lý công việc'));
    contentEl.createEl('p', { cls: 'pt-setup-desc', text: tr('Dựng sẵn mọi thứ Pie Tasks cần. Chỉ tạo file còn thiếu — file đã có sẽ được giữ nguyên.') });
    const p = this.plugin;
    let folder = p.settings.projectsFolder || DEFAULT_PROJECTS_FOLDER;
    const items = [
      { label: 'Bảng công việc', path: obsidian.normalizePath(p.prof().taskPath || 'TASKS.md') },
      { label: 'File nhân sự', path: obsidian.normalizePath(p.settings.defaultPeoplePath || DEFAULT_PEOPLE) },
      { label: 'Dashboard dự án (Bases)', path: () => obsidian.normalizePath(folder) + '/Dashboard Projects.base' },
      { label: 'Dashboard việc con (Dataview)', path: obsidian.normalizePath(p.settings.taskDashboardPath || DEFAULT_DASH) },
    ];
    const list = contentEl.createEl('div', { cls: 'pt-setup-list' });
    const renderList = () => {
      list.empty();
      items.forEach(it => {
        const path = typeof it.path === 'function' ? it.path() : it.path;
        const has = !!this.app.vault.getAbstractFileByPath(path);
        const row = list.createEl('div', { cls: 'pt-setup-row' + (has ? ' has' : '') });
        row.createEl('span', { cls: 'pt-setup-ic' }).innerHTML = has ? I.check : I.plus;
        const tx = row.createEl('div', { cls: 'pt-setup-tx' });
        tx.createEl('div', { cls: 'pt-setup-lb', text: it.label });
        tx.createEl('div', { cls: 'pt-setup-pt', text: path });
        row.createEl('span', { cls: 'pt-setup-st', text: has ? 'đã có' : 'sẽ tạo' });
      });
    };
    renderList();
    new obsidian.Setting(contentEl).setName(tr('Thư mục chứa dự án')).setDesc(tr('Nơi đặt Dashboard Projects.base + các note có "subtype: project".'))
      .addText(t => t.setValue(folder).onChange(v => { folder = v.trim() || DEFAULT_PROJECTS_FOLDER; renderList(); }));
    const foot = contentEl.createEl('div', { cls: 'pt-setup-foot' });
    foot.createEl('button', { text: tr('Huỷ') }).addEventListener('click', () => this.close());
    const go = foot.createEl('button', { cls: 'mod-cta', text: tr('Thiết lập') });
    go.addEventListener('click', async () => {
      go.disabled = true; go.setText(tr('Đang dựng…'));
      p.settings.projectsFolder = obsidian.normalizePath(folder); await p.saveSettings();
      const r = await p.setupSystem(folder);
      new obsidian.Notice(tr('Pie Tasks: tạo ') + r.created.length + tr(' file') + (r.skipped.length ? tr(', giữ ') + r.skipped.length + tr(' file đã có') : '') + '.');
      this.close(); await p.openLive();
    });
  }
  onClose() { this.contentEl.empty(); }
}

class PieSettingTab extends obsidian.PluginSettingTab {
  constructor(app, plugin) { super(app, plugin); this.plugin = plugin; }
  display() {
    const { containerEl } = this; containerEl.empty();
    this.renderHeader(containerEl);
    new obsidian.Setting(containerEl).setName(tr('Ngôn ngữ')).setDesc(tr('Ngôn ngữ hiển thị của plugin (dữ liệu trong file vẫn giữ nguyên).'))
      .addDropdown(d => d.addOption('vi', 'Tiếng Việt').addOption('en', 'English')
        .setValue(this.plugin.settings.lang || 'vi')
        .onChange(async v => { this.plugin.settings.lang = v; LANG = v; await this.plugin.saveSettings(); this.plugin.refreshLiveViews(); this.display(); }));
    new obsidian.Setting(containerEl).setName(tr('Thiết lập nhanh hệ thống')).setClass('pt-setup-cta')
      .setDesc(tr('Dựng 1 lần: bảng công việc + file nhân sự + Dashboard dự án (Bases) + Dashboard việc con (Dataview). Chỉ tạo file còn thiếu.'))
      .addButton(b => { b.setButtonText(tr('Thiết lập nhanh')).setCta().onClick(() => new SetupModal(this.app, this.plugin).open()); b.buttonEl.addClass('pt-btn-ic'); b.buttonEl.insertAdjacentHTML('afterbegin', I.zap); });
    new obsidian.Setting(containerEl).setName(tr('Bảng công việc (profile)'))
      .setDesc(tr('Mỗi bảng = 1 file .md riêng (quản lý theo project). Đổi bảng bằng chip góc trên-trái board.'))
      .addButton(b => b.setButtonText(tr('Quản lý bảng')).setCta().onClick(() => new ProfileManagerModal(this.app, this.plugin).open()));
    new obsidian.Setting(containerEl).setName(tr('Đường dẫn file bảng đang mở'))
      .setDesc(tr('File Markdown của bảng hiện tại "') + this.plugin.prof().name + '" (tương đối gốc vault).')
      .addText(t => t.setPlaceholder('TASKS.md').setValue(this.plugin.prof().taskPath).onChange(async v => { this.plugin.prof().taskPath = v.trim() || 'TASKS.md'; await this.plugin.saveSettings(); await this.plugin.reload(); }));
    new obsidian.Setting(containerEl)
      .setName(tr('File nhân sự mặc định (dùng chung)'))
      .setDesc(tr('File bảng nhân sự cho picker "Thêm người phụ trách" (dạng | Tên | ID | …). Bảng nào để trống peoplePath sẽ dùng file này.'))
      .addText(t => t.setPlaceholder('vd: People.md').setValue(this.plugin.settings.defaultPeoplePath || DEFAULT_PEOPLE).onChange(async v => { this.plugin.settings.defaultPeoplePath = v.trim() || DEFAULT_PEOPLE; await this.plugin.saveSettings(); }));
    new obsidian.Setting(containerEl)
      .setName(tr('Phạm vi bảng việc con theo dự án'))
      .setDesc(tr('Dataview gom task con theo dự án trong note dashboard. "Tất cả" = mọi task gắn dự án trong vault (kể cả checklist thừa kế frontmatter). "Chỉ Pie Tasks" = chỉ task gắn dự án trực tiếp trên các bảng Pie.'))
      .addDropdown(d => d.addOption('all', 'Tất cả task gắn dự án trong vault').addOption('pie', 'Chỉ task từ các bảng Pie Tasks')
        .setValue(this.plugin.settings.taskDashboardScope || 'all')
        .onChange(async v => { this.plugin.settings.taskDashboardScope = v; await this.plugin.saveSettings(); await this.plugin.writeTaskDashboard(); }));
    new obsidian.Setting(containerEl)
      .setName(tr('Đường dẫn note dashboard việc con'))
      .setDesc(tr('Note chứa 2 khối Dataview (vùng tự sinh giữa marker). Chưa có sẽ tự tạo khi lưu phạm vi.'))
      .addText(t => t.setPlaceholder(DEFAULT_DASH).setValue(this.plugin.settings.taskDashboardPath || DEFAULT_DASH).onChange(async v => { this.plugin.settings.taskDashboardPath = v.trim() || DEFAULT_DASH; await this.plugin.saveSettings(); }))
      .addButton(b => b.setButtonText(tr('Ghi lại')).onClick(async () => { await this.plugin.writeTaskDashboard(); new obsidian.Notice(tr('Đã ghi dashboard việc con.')); }));
    new obsidian.Setting(containerEl)
      .setName(tr('Hiện danh sách bước làm trên thẻ'))
      .setDesc(tr('Bật: thẻ việc hiện đầy đủ các bước (tick được ngay trên thẻ). Tắt: chỉ hiện số đếm dạng 0/3.'))
      .addToggle(t => t.setValue(!!this.plugin.settings.stepsOnCard).onChange(async v => { this.plugin.settings.stepsOnCard = v; await this.plugin.saveSettings(); this.plugin.refreshLiveViews(); }));
  }
  renderHeader(containerEl) {
    const header = containerEl.createDiv({ cls: 'pt-settings-header' });
    header.createDiv({ cls: 'pt-settings-avatar' }).insertAdjacentHTML('afterbegin', `<img src="${PT_LOGO}" alt="Pie Tasks" />`);
    const info = header.createDiv({ cls: 'pt-settings-info' });
    info.createDiv({ cls: 'pt-settings-title', text: 'Pie Tasks' });
    info.createDiv({ cls: 'pt-settings-desc', text: tr('Quản lý công việc từ file Markdown — bảng, danh sách, lịch, dashboard.') });
    const links = containerEl.createDiv({ cls: 'pt-settings-links' });
    PT_CHANNELS.forEach(c => {
      const btn = links.createEl('button', { cls: 'pt-settings-link' });
      btn.insertAdjacentHTML('afterbegin', I[c.icon]);
      btn.createSpan({ text: c.icon === 'cap' ? tr(c.label) : c.label });
      btn.addEventListener('click', () => window.open(c.url, '_blank'));
    });
  }
}

module.exports = PieTasksPlugin;
